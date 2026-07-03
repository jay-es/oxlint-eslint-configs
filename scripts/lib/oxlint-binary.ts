import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

/**
 * oxlint パッケージの実行ファイルのパスを返す。
 * `oxlint/bin/oxlint` は package.json の exports に定義されていないため、
 * exports に含まれる package.json 経由でパッケージのルートを特定してから解決する。
 */
export function resolveOxlintBinaryPath(): string {
  const oxlintPackageJsonPath = require.resolve("oxlint/package.json");
  return path.join(path.dirname(oxlintPackageJsonPath), "bin", "oxlint");
}
