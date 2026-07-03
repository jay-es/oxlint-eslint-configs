// 生成済みの config は dist/eslint-recommended.js, dist/typescript-recommended.js などの
// サブパスとして提供される。ここでは、任意の ESLint 互換 config を自前で
// oxlint 用に変換したい利用者向けのユーティリティを公開する。
export { filterSupportedRules } from "./filter-rules.ts";
export { mergeFlatConfigRules } from "./merge-flat-config-rules.ts";
