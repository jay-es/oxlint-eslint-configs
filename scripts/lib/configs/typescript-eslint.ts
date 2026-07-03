import tseslint from "typescript-eslint";
import { filterSupportedRules, OXLINT_PLUGIN_NAME_BY_SOURCE } from "../../../src/filter-rules.ts";
import { mergeFlatConfigRules } from "../../../src/merge-flat-config-rules.ts";
import type { GeneratedConfig } from "../generated-config.ts";
import { toKebabCase } from "../kebab-case.ts";

// ルールを持たず languageOptions/plugins のセットアップのみを行う config のため対象外
const EXCLUDED_CONFIG_NAMES = new Set(["base"]);

// dist のファイル名接頭辞は、typescript-eslint のルールが対応する oxlint 側のプラグイン名に合わせる
const OXLINT_FILE_PREFIX = OXLINT_PLUGIN_NAME_BY_SOURCE["@typescript-eslint"];

/**
 * typescript-eslint の各 config を、oxlint が対応しているルールだけに絞って返す。
 */
export function buildTypescriptEslintConfigs(): GeneratedConfig[] {
  return Object.entries(tseslint.configs)
    .filter(([name]) => !EXCLUDED_CONFIG_NAMES.has(name))
    .map(([name, config]) => ({
      fileName: `${OXLINT_FILE_PREFIX}-${toKebabCase(name)}.js`,
      rules: filterSupportedRules(mergeFlatConfigRules(config)),
      source: `typescript-eslint ${name} config`,
    }));
}
