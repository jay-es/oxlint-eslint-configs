import importX from "eslint-plugin-import-x";
import { filterSupportedRules, OXLINT_PLUGIN_NAME_BY_SOURCE } from "../../../src/filter-rules.ts";
import { mergeFlatConfigRules } from "../../../src/merge-flat-config-rules.ts";
import type { GeneratedConfig } from "../generated-config.ts";
import { toKebabCase } from "../kebab-case.ts";

// 対象にする config 名。"flat/*" は同内容のエイリアスのため除外。
// "react"/"react-native"/"electron" はルールを持たず resolver 設定のみのため除外。
const INCLUDED_CONFIG_NAMES = new Set([
  "recommended",
  "errors",
  "warnings",
  "stage-0",
  "typescript",
]);

// dist のファイル名接頭辞は、eslint-plugin-import-x のルールが対応する oxlint 側のプラグイン名に合わせる
const OXLINT_FILE_PREFIX = OXLINT_PLUGIN_NAME_BY_SOURCE["import-x"];

/**
 * eslint-plugin-import-x の各 config を、oxlint が対応しているルールだけに絞って返す。
 */
export function buildEslintPluginImportXConfigs(): GeneratedConfig[] {
  return Object.entries(importX.configs)
    .filter(([name]) => INCLUDED_CONFIG_NAMES.has(name))
    .map(([name, config]) => ({
      fileName: `${OXLINT_FILE_PREFIX}/${toKebabCase(name)}.js`,
      rules: filterSupportedRules(mergeFlatConfigRules(config)),
      source: `eslint-plugin-import-x ${name} config`,
    }));
}
