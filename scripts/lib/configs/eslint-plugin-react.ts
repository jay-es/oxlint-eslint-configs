import react from "eslint-plugin-react";
import { filterSupportedRules, OXLINT_PLUGIN_NAME_BY_SOURCE } from "../../../src/filter-rules.ts";
import { mergeFlatConfigRules } from "../../../src/merge-flat-config-rules.ts";
import type { GeneratedConfig } from "../generated-config.ts";
import { toKebabCase } from "../kebab-case.ts";

// "jsx-runtime" はルールを増やすのではなく、新しい JSX transform 向けに
// recommended の一部ルールを無効化するための追加設定のため対象外。
// "flat" 配下は非 flat 版と同内容のエイリアスのため除外。
const INCLUDED_CONFIG_NAMES = new Set(["recommended", "all"]);

const OXLINT_FILE_PREFIX = OXLINT_PLUGIN_NAME_BY_SOURCE.react;

/**
 * eslint-plugin-react の各 config を、oxlint が対応しているルールだけに絞って返す。
 */
export function buildEslintPluginReactConfigs(): GeneratedConfig[] {
  return Object.entries(react.configs)
    .filter(([name]) => INCLUDED_CONFIG_NAMES.has(name))
    .map(([name, config]) => ({
      fileName: `${OXLINT_FILE_PREFIX}/${toKebabCase(name)}.js`,
      rules: filterSupportedRules(mergeFlatConfigRules(config)),
      source: `eslint-plugin-react ${name} config`,
    }));
}
