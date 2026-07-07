import { getOxlintRulesByPlugin } from "./oxlint-schema.ts";
import { parseRuleKey } from "./parse-rule-key.ts";

/**
 * ESLint 系のプラグイン名から、oxlint の configuration schema 上でのプラグイン名への対応表。
 * ここに載っていないプラグインのルールは oxlint 非対応として除外される。
 * ファイル名の接頭辞にもこの値を使う(例: "typescript-recommended.js")。
 */
export const OXLINT_PLUGIN_NAME_BY_SOURCE: Record<string, string> = {
  eslint: "eslint",
  "@typescript-eslint": "typescript",
  unicorn: "unicorn",
  // oxlint は import/ 名前空間のみを持つ (import-x/ は存在しない)ため、
  // よりメンテされている eslint-plugin-import-x を取得元にしつつ import に変換する。
  "import-x": "import",
  promise: "promise",
  n: "node",
  react: "react",
  "react-perf": "react-perf",
  // @next/eslint-plugin-next は "@next/next/rule-name" のように、
  // プラグイン名自体に "/" を含む形でルールを登録している。
  "@next/next": "nextjs",
};

// プラグイン名に "/" を含むもの(例: "@next/next")を正しく切り出せるよう、
// 既知のプレフィックスを長い順に試してから、単純な最初の "/" 区切りにフォールバックする。
const KNOWN_SOURCE_PREFIXES = Object.keys(OXLINT_PLUGIN_NAME_BY_SOURCE)
  .filter((prefix) => prefix !== "eslint")
  .sort((a, b) => b.length - a.length);

function parseSourceRuleKey(ruleKey: string): [plugin: string, rule: string] {
  for (const prefix of KNOWN_SOURCE_PREFIXES) {
    if (ruleKey.startsWith(`${prefix}/`)) {
      return [prefix, ruleKey.slice(prefix.length + 1)];
    }
  }
  return parseRuleKey(ruleKey);
}

function toOxlintRuleKey(oxlintPlugin: string, ruleName: string): string {
  return oxlintPlugin === "eslint" ? ruleName : `${oxlintPlugin}/${ruleName}`;
}

/**
 * rules のうち、oxlint が対応しているルールだけを残し、キーを oxlint の命名規則
 * (例: "@typescript-eslint/no-explicit-any" → "typescript/no-explicit-any")に変換する。
 * 複数プラグインのルールが混在する config でもそのまま渡せる。
 */
export function filterSupportedRules(rules: Record<string, unknown>): Record<string, unknown> {
  const oxlintRulesByPlugin = getOxlintRulesByPlugin();
  const result: Record<string, unknown> = {};

  for (const [ruleKey, value] of Object.entries(rules)) {
    const [sourcePlugin, ruleName] = parseSourceRuleKey(ruleKey);
    const oxlintPlugin = OXLINT_PLUGIN_NAME_BY_SOURCE[sourcePlugin];
    if (oxlintPlugin === undefined) continue;
    if (!oxlintRulesByPlugin[oxlintPlugin]?.has(ruleName)) continue;

    result[toOxlintRuleKey(oxlintPlugin, ruleName)] = value;
  }

  // typescript-eslint など一部のプラグインは、eslint 本体のルールと同名のルールを
  // 提供し、その代わりに同名の eslint 本体ルールを "off" にする(例: "no-unused-vars")。
  // oxlint がプラグイン側のルールに未対応の場合、素直にフィルタすると両方消えて
  // 何もチェックされなくなってしまうため、oxlint が eslint 本体側のルールには対応している場合は
  // そちらの名前でプラグイン側の設定値を復元する。
  for (const [ruleKey, value] of Object.entries(rules)) {
    const [sourcePlugin, ruleName] = parseSourceRuleKey(ruleKey);
    if (sourcePlugin === "eslint") continue;

    const oxlintPlugin = OXLINT_PLUGIN_NAME_BY_SOURCE[sourcePlugin];
    if (oxlintPlugin === undefined) continue;
    if (oxlintRulesByPlugin[oxlintPlugin]?.has(ruleName)) continue;

    const isDisabledInFavorOfPluginRule = rules[ruleName] === "off";
    if (isDisabledInFavorOfPluginRule && oxlintRulesByPlugin.eslint?.has(ruleName)) {
      result[ruleName] = value;
    }
  }

  return result;
}
