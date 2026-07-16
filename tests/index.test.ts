import { expect, test } from "vite-plus/test";
import { filterSupportedRules } from "../src/filter-rules.ts";
import { mergeFlatConfigRules } from "../src/merge-flat-config-rules.ts";

test("mergeFlatConfigRules merges rules in order, later overriding earlier", () => {
  const merged = mergeFlatConfigRules([
    { rules: { "no-unused-vars": "error", "no-var": "off" } },
    { rules: { "no-unused-vars": "off" } },
  ]);

  expect(merged).toStrictEqual({ "no-unused-vars": "off", "no-var": "off" });
});

test("eslint recommended rules supported by oxlint include no-unused-vars", async () => {
  const eslintJs = await import("@eslint/js");
  const filtered = filterSupportedRules(eslintJs.default.configs.recommended.rules);

  expect(filtered["no-unused-vars"]).toBe("error");
  // eslint の recommended には含まれるが、oxlint の対応表には存在しないルールの例
  expect(filtered["no-dupe-args"]).toBeUndefined();
});

test("typescript-eslint recommended rules supported by oxlint are renamed to the typescript/ prefix", async () => {
  const tseslint = await import("typescript-eslint");
  const merged = mergeFlatConfigRules(tseslint.default.configs.recommended);
  const filtered = filterSupportedRules(merged);

  expect(filtered["typescript/no-explicit-any"]).toBe("error");
  // typescript-eslint の recommended には含まれるが、oxlint の対応表には存在しないルールの例
  expect(filtered["typescript/no-array-constructor"]).toBeUndefined();
});

test("filterSupportedRules restores the base rule when its oxlint-unsupported plugin counterpart disabled it", () => {
  // typescript-eslint の "all" などにある典型的なパターン:
  // ベースルールを off にしつつ、プラグイン独自版を有効化する
  const filtered = filterSupportedRules({
    "class-methods-use-this": "off",
    "@typescript-eslint/class-methods-use-this": "error",
  });

  // oxlint は typescript/class-methods-use-this を持たないため、
  // ベースルール側にプラグイン版の設定値を復元する
  expect(filtered).toStrictEqual({ "class-methods-use-this": "error" });
});

test("typescript-eslint all config keeps class-methods-use-this enabled", async () => {
  const tseslint = await import("typescript-eslint");
  const merged = mergeFlatConfigRules(tseslint.default.configs.all);
  const filtered = filterSupportedRules(merged);

  expect(filtered["class-methods-use-this"]).toBe("error");
  expect(filtered["typescript/class-methods-use-this"]).toBeUndefined();
});

test("filterSupportedRules strips option keys that oxlint doesn't recognize", () => {
  // eslint-plugin-jsx-a11y の includeRoles は oxlint のスキーマに存在しないため除去される
  const filtered = filterSupportedRules({
    "jsx-a11y/control-has-associated-label": [
      "off",
      { ignoreElements: ["audio"], includeRoles: ["alert", "dialog"] },
    ],
  });

  expect(filtered["jsx-a11y/control-has-associated-label"]).toStrictEqual([
    "off",
    { ignoreElements: ["audio"] },
  ]);
});

test("filterSupportedRules keeps arbitrary option keys for rules with an open option schema", () => {
  // no-interactive-element-to-noninteractive-role のオプションはタグ名 -> ロール名の
  // 任意キーマップなので、キーを列挙して絞り込むことはできない(そのまま残す)
  const filtered = filterSupportedRules({
    "jsx-a11y/no-interactive-element-to-noninteractive-role": [
      "error",
      { tr: ["none", "presentation"] },
    ],
  });

  expect(filtered["jsx-a11y/no-interactive-element-to-noninteractive-role"]).toStrictEqual([
    "error",
    { tr: ["none", "presentation"] },
  ]);
});
