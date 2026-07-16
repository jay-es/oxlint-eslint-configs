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
    [definitionName: string]: unknown;
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

/**
 * ルールのオプション定義(`anyOf` 内の `[severity, options]` タプル)から、
 * $ref 先のオプションスキーマオブジェクトを解決する。
 * 該当しない形(オプションなし、severity のみ、$ref がないなど)は undefined を返す。
 */
function resolveRuleOptionsSchema(
  definitions: OxlintConfigurationSchema["definitions"],
  ruleSchema: unknown,
): { properties?: Record<string, unknown>; additionalProperties?: unknown } | undefined {
  if (ruleSchema === null || typeof ruleSchema !== "object" || !("anyOf" in ruleSchema)) {
    return undefined;
  }

  const anyOf = (ruleSchema as { anyOf: unknown }).anyOf;
  if (!Array.isArray(anyOf)) return undefined;

  const tuple = anyOf.find(
    (option) => option !== null && typeof option === "object" && "items" in option,
  ) as { items?: unknown[] } | undefined;
  const ref = tuple?.items?.[1] as { $ref?: string } | undefined;
  if (typeof ref?.$ref !== "string") return undefined;

  const definitionName = ref.$ref.split("/").pop();
  if (definitionName === undefined) return undefined;

  return definitions[definitionName] as
    | { properties?: Record<string, unknown>; additionalProperties?: unknown }
    | undefined;
}

function buildOxlintRuleOptionKeys(): Map<string, Set<string>> {
  const schema = loadOxlintSchema();
  const result = new Map<string, Set<string>>();

  for (const [ruleKey, ruleSchema] of Object.entries(schema.definitions.DummyRuleMap.properties)) {
    const optionsSchema = resolveRuleOptionsSchema(schema.definitions, ruleSchema);
    // キーを列挙できて、かつ未知キーを許さないもの(additionalProperties: false)だけを対象にする。
    // 任意キーを許すオプション(例: タグ名 -> ロール名のマップ)はここで登録せず、素通りさせる。
    if (optionsSchema?.properties !== undefined && optionsSchema.additionalProperties === false) {
      result.set(ruleKey, new Set(Object.keys(optionsSchema.properties)));
    }
  }

  return result;
}

let oxlintRuleOptionKeysCache: Map<string, Set<string>> | undefined;

/**
 * oxlint がサポートするルールのうち、オプションのキーを列挙できるもの(未知キーを
 * 許さない = additionalProperties: false)についてのみ、ルールキー -> 許可オプション
 * キーの Set を返す。任意キーを許すオプションを持つルールはここには含まれない。
 */
export function getOxlintRuleOptionKeys(): Map<string, Set<string>> {
  oxlintRuleOptionKeysCache ??= buildOxlintRuleOptionKeys();
  return oxlintRuleOptionKeysCache;
}
