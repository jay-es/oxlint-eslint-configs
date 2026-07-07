import vitest from "@vitest/eslint-plugin";
import { filterSupportedRules, OXLINT_PLUGIN_NAME_BY_SOURCE } from "../../../src/filter-rules.ts";
import { mergeFlatConfigRules } from "../../../src/merge-flat-config-rules.ts";
import type { GeneratedConfig } from "../generated-config.ts";
import { toKebabCase } from "../kebab-case.ts";

// "legacy-*" は同じルールを "@vitest/" 接頭辞で登録した旧 eslintrc 向けエイリアスのため除外。
// "env" はルールを持たず globals の設定のみのため除外。
const INCLUDED_CONFIG_NAMES = new Set(["recommended", "all"]);

const OXLINT_FILE_PREFIX = OXLINT_PLUGIN_NAME_BY_SOURCE.vitest;

/**
 * @vitest/eslint-plugin の各 config を、oxlint が対応しているルールだけに絞って返す。
 */
export function buildEslintPluginVitestConfigs(): GeneratedConfig[] {
  return Object.entries(vitest.configs)
    .filter(([name]) => INCLUDED_CONFIG_NAMES.has(name))
    .map(([name, config]) => ({
      fileName: `${OXLINT_FILE_PREFIX}/${toKebabCase(name)}.js`,
      rules: filterSupportedRules(mergeFlatConfigRules(config)),
      source: `@vitest/eslint-plugin ${name} config`,
    }));
}
