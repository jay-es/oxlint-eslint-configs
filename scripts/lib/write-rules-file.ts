import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * ルール設定をコメント付きの ESM ファイルとして書き出す。
 */
export async function writeRulesFile(
  rules: Record<string, unknown>,
  outputPath: string | URL,
  sourceDescription: string,
): Promise<void> {
  const resolvedPath = outputPath instanceof URL ? fileURLToPath(outputPath) : outputPath;

  const output = `// Source: ${sourceDescription}

export const rules = ${JSON.stringify(rules, null, 2)};
`;

  await mkdir(path.dirname(resolvedPath), { recursive: true });
  await writeFile(resolvedPath, output);
}
