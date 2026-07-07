import vue from "eslint-plugin-vue";
import { filterSupportedRules, OXLINT_PLUGIN_NAME_BY_SOURCE } from "../../../src/filter-rules.ts";
import { mergeFlatConfigRules } from "../../../src/merge-flat-config-rules.ts";
import type { GeneratedConfig } from "../generated-config.ts";
import { toKebabCase } from "../kebab-case.ts";

// 非 flat 版 (例: "recommended") は "extends" でファイルパスを辿って前段の config を
// 継承する eslintrc 形式で、rules だけでは中身が欠けてしまう。"flat/" 版は継承元を
// 配列内に展開済みなのでこちらを使う。"vue2-*" (Vue 2 向け) や "base"/"no-layout-rules"
// (単体では意味を持たない設定) は対象外。
const INCLUDED_CONFIG_NAMES = new Set([
  "flat/essential",
  "flat/strongly-recommended",
  "flat/strongly-recommended-error",
  "flat/recommended",
  "flat/recommended-error",
]);

const OXLINT_FILE_PREFIX = OXLINT_PLUGIN_NAME_BY_SOURCE.vue;

/**
 * eslint-plugin-vue の各 config を、oxlint が対応しているルールだけに絞って返す。
 */
export function buildEslintPluginVueConfigs(): GeneratedConfig[] {
  return Object.entries(vue.configs)
    .filter(([name]) => INCLUDED_CONFIG_NAMES.has(name))
    .map(([name, config]) => ({
      fileName: `${OXLINT_FILE_PREFIX}/${toKebabCase(name.replace("flat/", ""))}.js`,
      rules: filterSupportedRules(mergeFlatConfigRules(config)),
      source: `eslint-plugin-vue ${name} config`,
    }));
}
