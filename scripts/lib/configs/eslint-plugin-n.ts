import n from "eslint-plugin-n";
import { filterSupportedRules, OXLINT_PLUGIN_NAME_BY_SOURCE } from "../../../src/filter-rules.ts";
import { mergeFlatConfigRules } from "../../../src/merge-flat-config-rules.ts";
import type { GeneratedConfig } from "../generated-config.ts";
import { toKebabCase } from "../kebab-case.ts";

// "recommended" は固定のエイリアスではなく、このスクリプトを実行する環境の package.json の
// "type" フィールドを見て "recommended-module"/"recommended-script" のどちらかを動的に返す
// (eslint-plugin-n/lib/configs/recommended.js 参照)。生成結果が実行環境に依存してしまうため、
// 明示的に安定した "recommended-module"/"recommended-script" の方を直接使う。
// "all" は非 flat 版が存在せず "flat/all" のみ公開されているため、そちらを採用する。
const CONFIG_NAME_OVERRIDES: Record<string, string> = {
  "flat/all": "all",
};
const INCLUDED_CONFIG_NAMES = new Set(["recommended-module", "recommended-script", "flat/all"]);

const OXLINT_FILE_PREFIX = OXLINT_PLUGIN_NAME_BY_SOURCE.n;

/**
 * eslint-plugin-n の各 config を、oxlint が対応しているルールだけに絞って返す。
 */
export function buildEslintPluginNConfigs(): GeneratedConfig[] {
  return Object.entries(n.configs)
    .filter(([name]) => INCLUDED_CONFIG_NAMES.has(name))
    .map(([name, config]) => {
      const outputName = CONFIG_NAME_OVERRIDES[name] ?? name;
      return {
        fileName: `${OXLINT_FILE_PREFIX}-${toKebabCase(outputName)}.js`,
        rules: filterSupportedRules(mergeFlatConfigRules(config)),
        source: `eslint-plugin-n ${name} config`,
      };
    });
}
