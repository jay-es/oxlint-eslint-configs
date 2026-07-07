import jsxA11y from "eslint-plugin-jsx-a11y";
import { filterSupportedRules, OXLINT_PLUGIN_NAME_BY_SOURCE } from "../../../src/filter-rules.ts";
import { mergeFlatConfigRules } from "../../../src/merge-flat-config-rules.ts";
import type { GeneratedConfig } from "../generated-config.ts";
import { toKebabCase } from "../kebab-case.ts";

const OXLINT_FILE_PREFIX = OXLINT_PLUGIN_NAME_BY_SOURCE["jsx-a11y"];

/**
 * eslint-plugin-jsx-a11y の各 config を、oxlint が対応しているルールだけに絞って返す。
 */
export function buildEslintPluginJsxA11yConfigs(): GeneratedConfig[] {
  return Object.entries(jsxA11y.configs).map(([name, config]) => ({
    fileName: `${OXLINT_FILE_PREFIX}-${toKebabCase(name)}.js`,
    rules: filterSupportedRules(mergeFlatConfigRules(config)),
    source: `eslint-plugin-jsx-a11y ${name} config`,
  }));
}
