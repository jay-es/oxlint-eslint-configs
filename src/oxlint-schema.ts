import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { parseRuleKey } from "./parse-rule-key.ts";

const require = createRequire(import.meta.url);

interface OxlintConfigurationSchema {
  definitions: {
    DummyRuleMap: {
      properties: Record<string, unknown>;
    };
  };
}

function loadOxlintSchema(): OxlintConfigurationSchema {
  const oxlintPackageJsonPath = require.resolve("oxlint/package.json");
  const schemaPath = path.join(path.dirname(oxlintPackageJsonPath), "configuration_schema.json");
  const schemaText = readFileSync(schemaPath, "utf8");
  return JSON.parse(schemaText) as OxlintConfigurationSchema;
}

function buildOxlintRulesByPlugin(): Record<string, Set<string>> {
  const schema = loadOxlintSchema();
  const ruleKeys = Object.keys(schema.definitions.DummyRuleMap.properties);
  const grouped = Object.groupBy(ruleKeys.map(parseRuleKey), ([plugin]) => plugin);

  return Object.fromEntries(
    Object.entries(grouped).map(([plugin, entries]) => [
      plugin,
      new Set((entries ?? []).map(([, rule]) => rule)),
    ]),
  );
}

let oxlintRulesByPluginCache: Record<string, Set<string>> | undefined;

/**
 * oxlint がサポートするルールを、プラグイン名 -> ルール名の Set にまとめたものを返す。
 * プラグイン接頭辞のないルール(例: "no-unused-vars")は "eslint" プラグイン扱いとする。
 * スキーマの読み込みは初回呼び出し時のみ行い、以降はキャッシュを返す。
 */
export function getOxlintRulesByPlugin(): Record<string, Set<string>> {
  oxlintRulesByPluginCache ??= buildOxlintRulesByPlugin();
  return oxlintRulesByPluginCache;
}
