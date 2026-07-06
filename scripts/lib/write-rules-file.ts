import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * ルール設定をコメント付きの ESM ファイルとして書き出す。
 * 型情報を持たない .js のままだと利用側で implicit any の警告が出るため、
 * 同名の .d.ts も合わせて生成する。型は oxlint 本体の DummyRuleMap をそのまま使う。
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

  const dtsOutput = `// Source: ${sourceDescription}

import type { DummyRuleMap } from "oxlint";

export declare const rules: DummyRuleMap;
`;

  await mkdir(path.dirname(resolvedPath), { recursive: true });
  await writeFile(resolvedPath, output);
  await writeFile(resolvedPath.replace(/\.js$/, ".d.ts"), dtsOutput);
}
