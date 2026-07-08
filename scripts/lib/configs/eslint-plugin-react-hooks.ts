import reactHooks from "eslint-plugin-react-hooks";
import { filterSupportedRules, OXLINT_PLUGIN_NAME_BY_SOURCE } from "../../../src/filter-rules.ts";
import { mergeFlatConfigRules } from "../../../src/merge-flat-config-rules.ts";
import type { GeneratedConfig } from "../generated-config.ts";

// "recommended" と "recommended-latest" は oxlint がサポートする2ルール
// (rules-of-hooks, exhaustive-deps) に絞ると同内容になるため "recommended-latest" のみ採用。
// "flat" はルールを持たない空の config のため対象外。
const OXLINT_PLUGIN_NAME = OXLINT_PLUGIN_NAME_BY_SOURCE["react-hooks"];

/**
 * eslint-plugin-react-hooks の recommended-latest config を、
 * oxlint が対応しているルールだけに絞って返す。oxlint 側の react/ 名前空間にまとめる。
 */
export function buildEslintPluginReactHooksConfigs(): GeneratedConfig[] {
  return [
    {
      fileName: `${OXLINT_PLUGIN_NAME}/hooks-recommended.js`,
      rules: filterSupportedRules(mergeFlatConfigRules(reactHooks.configs["recommended-latest"])),
      source: "eslint-plugin-react-hooks recommended-latest config",
    },
  ];
}
