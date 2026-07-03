function getRules(config: unknown): Record<string, unknown> {
  if (
    config !== null &&
    typeof config === "object" &&
    "rules" in config &&
    config.rules !== null &&
    typeof config.rules === "object"
  ) {
    return config.rules as Record<string, unknown>;
  }
  return {};
}

/**
 * ESLint flat config 形式(単一の config オブジェクト、またはその配列)から
 * rules を順番にマージした結果を返す。後の要素の設定で上書きされる点は
 * ESLint の flat config が配列を適用する挙動と同じ。
 *
 * config の型はツールによって微妙に異なる(例: typescript-eslint 独自の RuleEntry 型)ため、
 * 厳密な型を要求せず unknown で受け取り、実行時に rules の有無を判定する。
 */
export function mergeFlatConfigRules(config: unknown): Record<string, unknown> {
  const configs = Array.isArray(config) ? config : [config];
  return Object.assign({}, ...configs.map(getRules));
}
