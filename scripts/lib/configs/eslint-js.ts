import eslintJs from "@eslint/js";
import { filterSupportedRules } from "../../../src/filter-rules.ts";
import type { GeneratedConfig } from "../generated-config.ts";

/**
 * @eslint/js の各 config を、oxlint が対応しているルールだけに絞って返す。
 */
export function buildEslintJsConfigs(): GeneratedConfig[] {
  const targets = [
    { name: "recommended", rules: eslintJs.configs.recommended.rules },
    { name: "all", rules: eslintJs.configs.all.rules },
  ] as const;

  return targets.map((target) => ({
    fileName: `eslint-${target.name}.js`,
    rules: filterSupportedRules(target.rules),
    source: `@eslint/js ${target.name} config`,
  }));
}
