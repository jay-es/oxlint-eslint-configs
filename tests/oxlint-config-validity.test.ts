import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, test } from "vite-plus/test";
import { CONFIG_BUILDERS } from "../scripts/lib/configs/index.ts";
import { resolveOxlintBinaryPath } from "../scripts/lib/oxlint-binary.ts";

const oxlintBinaryPath = resolveOxlintBinaryPath();

/**
 * 生成した rules を oxlint に実際に読み込ませ、
 * 存在しないルール名やオプション不正で設定エラーにならないことを確認する。
 */
async function assertRulesAreValidOxlintConfig(rules: Record<string, unknown>): Promise<void> {
  const dir = await mkdtemp(path.join(tmpdir(), "oxlint-config-"));
  try {
    const configPath = path.join(dir, ".oxlintrc.json");
    const samplePath = path.join(dir, "sample.ts");
    await writeFile(configPath, JSON.stringify({ rules }, null, 2));
    await writeFile(samplePath, "export const sample = 1;\n");

    const result = spawnSync(process.execPath, [oxlintBinaryPath, "-c", configPath, samplePath], {
      encoding: "utf8",
    });

    expect(result.stdout).not.toContain("Failed to parse oxlint configuration file");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

for (const buildConfigs of CONFIG_BUILDERS) {
  describe(buildConfigs.name, () => {
    for (const config of buildConfigs()) {
      test(config.fileName, async () => {
        await assertRulesAreValidOxlintConfig(config.rules);
      });
    }
  });
}
