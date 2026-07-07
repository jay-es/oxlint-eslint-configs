import jsdoc from "eslint-plugin-jsdoc";
import { filterSupportedRules, OXLINT_PLUGIN_NAME_BY_SOURCE } from "../../../src/filter-rules.ts";
import { mergeFlatConfigRules } from "../../../src/merge-flat-config-rules.ts";
import type { GeneratedConfig } from "../generated-config.ts";
import { toKebabCase } from "../kebab-case.ts";

// eslint-plugin-jsdoc has many near-duplicate presets (contents/logical/requirements/stylistic
// combined with typescript/tsdoc flavors and error variants). Once filtered down to the rules
// oxlint supports, they collapse into exactly these 6 distinct rule sets (the "-flavor" variants
// are identical to their non-flavor counterparts and are skipped).
const INCLUDED_CONFIG_NAMES = new Set([
  "recommended",
  "recommended-error",
  "recommended-typescript",
  "recommended-typescript-error",
  "recommended-tsdoc",
  "recommended-tsdoc-error",
]);

const OXLINT_FILE_PREFIX = OXLINT_PLUGIN_NAME_BY_SOURCE.jsdoc;

/**
 * eslint-plugin-jsdoc の各 config を、oxlint が対応しているルールだけに絞って返す。
 */
export function buildEslintPluginJsdocConfigs(): GeneratedConfig[] {
  return Object.entries(jsdoc.configs)
    .filter(([name]) => INCLUDED_CONFIG_NAMES.has(name))
    .map(([name, config]) => ({
      fileName: `${OXLINT_FILE_PREFIX}/${toKebabCase(name)}.js`,
      rules: filterSupportedRules(mergeFlatConfigRules(config)),
      source: `eslint-plugin-jsdoc ${name} config`,
    }));
}
