/**
 * "@typescript-eslint/no-explicit-any" のようなルールキーを
 * プラグイン名とルール名に分割する。接頭辞がない場合は "eslint" プラグイン扱いとする。
 */
export function parseRuleKey(ruleKey: string): [plugin: string, rule: string] {
  const slashIndex = ruleKey.indexOf("/");
  return slashIndex === -1
    ? ["eslint", ruleKey]
    : [ruleKey.slice(0, slashIndex), ruleKey.slice(slashIndex + 1)];
}
