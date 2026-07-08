import reactRefresh from "eslint-plugin-react-refresh";
import { filterSupportedRules, OXLINT_PLUGIN_NAME_BY_SOURCE } from "../../../src/filter-rules.ts";
import { mergeFlatConfigRules } from "../../../src/merge-flat-config-rules.ts";
import type { GeneratedConfig } from "../generated-config.ts";

const OXLINT_PLUGIN_NAME = OXLINT_PLUGIN_NAME_BY_SOURCE["react-refresh"];

/**
 * eslint-plugin-react-refresh の各 config を、oxlint が対応しているルールだけに絞って返す。
 * oxlint 側の react/ 名前空間にまとめる。
 */
export function buildEslintPluginReactRefreshConfigs(): GeneratedConfig[] {
  return Object.entries(reactRefresh.configs).map(([name, config]) => ({
    fileName: `${OXLINT_PLUGIN_NAME}/refresh-${name}.js`,
    rules: filterSupportedRules(mergeFlatConfigRules(config)),
    source: `eslint-plugin-react-refresh ${name} config`,
  }));
}
