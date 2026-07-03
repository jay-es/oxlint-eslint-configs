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
