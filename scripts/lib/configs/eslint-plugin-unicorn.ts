import unicorn from "eslint-plugin-unicorn";
import { filterSupportedRules, OXLINT_PLUGIN_NAME_BY_SOURCE } from "../../../src/filter-rules.ts";
import { mergeFlatConfigRules } from "../../../src/merge-flat-config-rules.ts";
import type { GeneratedConfig } from "../generated-config.ts";
import { toKebabCase } from "../kebab-case.ts";

// "flat/recommended" 等は "recommended" と同内容のエイリアスのため対象外
const EXCLUDED_CONFIG_NAMES = new Set(["flat/recommended", "flat/all"]);

// dist のファイル名接頭辞は、eslint-plugin-unicorn のルールが対応する oxlint 側のプラグイン名に合わせる
const OXLINT_FILE_PREFIX = OXLINT_PLUGIN_NAME_BY_SOURCE.unicorn;

/**
 * eslint-plugin-unicorn の各 config を、oxlint が対応しているルールだけに絞って返す。
 */
export function buildEslintPluginUnicornConfigs(): GeneratedConfig[] {
  return Object.entries(unicorn.configs)
    .filter(([name]) => !EXCLUDED_CONFIG_NAMES.has(name))
    .map(([name, config]) => ({
      fileName: `${OXLINT_FILE_PREFIX}/${toKebabCase(name)}.js`,
      rules: filterSupportedRules(mergeFlatConfigRules(config)),
      source: `eslint-plugin-unicorn ${name} config`,
    }));
}
