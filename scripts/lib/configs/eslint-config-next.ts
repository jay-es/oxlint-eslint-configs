import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { filterSupportedRules, OXLINT_PLUGIN_NAME_BY_SOURCE } from "../../../src/filter-rules.ts";
import { mergeFlatConfigRules } from "../../../src/merge-flat-config-rules.ts";
import type { GeneratedConfig } from "../generated-config.ts";

const require = createRequire(import.meta.url);

const OXLINT_PLUGIN_NAME = OXLINT_PLUGIN_NAME_BY_SOURCE["@next/next"];

/**
 * eslint-config-next (recommended / core-web-vitals) を、eslint-config-next 自体から
 * 読み込んで oxlint が対応しているルールだけに絞って返す。
 *
 * eslint-config-next の parser.js は require("next/dist/compiled/babel/eslint-parser") を
 * 実行しており、next 本体がインストールされていないと失敗する。今回必要なのは config の
 * .rules だけ(parser は使わない)なので、config データを読むためだけに next を依存に
 * 追加する代わりに、このモジュール ID だけを空のスタブ(../stubs/next-babel-eslint-parser-stub.cjs)
 * にリダイレクトしてから読み込む。
 */
export function buildEslintConfigNextConfigs(): GeneratedConfig[] {
  const Module = require("node:module") as typeof import("node:module");
  const ModuleWithInternals = Module as any;
  const originalResolveFilename = ModuleWithInternals._resolveFilename;
  const stubPath = fileURLToPath(
    new URL("../stubs/next-babel-eslint-parser-stub.cjs", import.meta.url),
  );

  ModuleWithInternals._resolveFilename = function (request: string, ...rest: unknown[]) {
    return request === "next/dist/compiled/babel/eslint-parser"
      ? stubPath
      : originalResolveFilename.call(this, request, ...(rest as any[]));
  };

  let recommended: unknown;
  let coreWebVitals: unknown;
  try {
    recommended = require("eslint-config-next");
    coreWebVitals = require("eslint-config-next/core-web-vitals");
  } finally {
    ModuleWithInternals._resolveFilename = originalResolveFilename;
  }

  return [
    {
      fileName: `${OXLINT_PLUGIN_NAME}/eslint-config-next.js`,
      rules: filterSupportedRules(mergeFlatConfigRules(recommended)),
      source: "eslint-config-next",
    },
    {
      fileName: `${OXLINT_PLUGIN_NAME}/eslint-config-next-core-web-vitals.js`,
      rules: filterSupportedRules(mergeFlatConfigRules(coreWebVitals)),
      source: "eslint-config-next core-web-vitals",
    },
  ];
}
