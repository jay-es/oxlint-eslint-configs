import next from "@next/eslint-plugin-next";
import { filterSupportedRules, OXLINT_PLUGIN_NAME_BY_SOURCE } from "../../../src/filter-rules.ts";
import { mergeFlatConfigRules } from "../../../src/merge-flat-config-rules.ts";
import type { GeneratedConfig } from "../generated-config.ts";
import { toKebabCase } from "../kebab-case.ts";

// "-legacy" 版は同内容の旧 eslintrc 形式のエイリアスのため除外。
const INCLUDED_CONFIG_NAMES = new Set(["recommended", "core-web-vitals"]);

const OXLINT_FILE_PREFIX = OXLINT_PLUGIN_NAME_BY_SOURCE["@next/next"];

/**
 * @next/eslint-plugin-next の各 config を、oxlint が対応しているルールだけに絞って返す。
 */
export function buildEslintPluginNextConfigs(): GeneratedConfig[] {
  return Object.entries(next.configs)
    .filter(([name]) => INCLUDED_CONFIG_NAMES.has(name))
    .map(([name, config]) => ({
      fileName: `${OXLINT_FILE_PREFIX}/${toKebabCase(name)}.js`,
      rules: filterSupportedRules(mergeFlatConfigRules(config)),
      source: `@next/eslint-plugin-next ${name} config`,
    }));
}
