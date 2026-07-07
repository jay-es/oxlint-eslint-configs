import jest from "eslint-plugin-jest";
import { filterSupportedRules, OXLINT_PLUGIN_NAME_BY_SOURCE } from "../../../src/filter-rules.ts";
import { mergeFlatConfigRules } from "../../../src/merge-flat-config-rules.ts";
import type { GeneratedConfig } from "../generated-config.ts";
import { toKebabCase } from "../kebab-case.ts";

// "flat/*" は同内容のエイリアスのため除外。
const INCLUDED_CONFIG_NAMES = new Set(["recommended", "style", "all"]);

const OXLINT_FILE_PREFIX = OXLINT_PLUGIN_NAME_BY_SOURCE.jest;

/**
 * eslint-plugin-jest の各 config を、oxlint が対応しているルールだけに絞って返す。
 */
export function buildEslintPluginJestConfigs(): GeneratedConfig[] {
  return Object.entries(jest.configs)
    .filter(([name]) => INCLUDED_CONFIG_NAMES.has(name))
    .map(([name, config]) => ({
      fileName: `${OXLINT_FILE_PREFIX}-${toKebabCase(name)}.js`,
      rules: filterSupportedRules(mergeFlatConfigRules(config)),
      source: `eslint-plugin-jest ${name} config`,
    }));
}
