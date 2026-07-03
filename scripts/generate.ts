import { CONFIG_BUILDERS } from "./lib/configs/index.ts";
import { writeRulesFile } from "./lib/write-rules-file.ts";

const distDir = new URL("../dist/", import.meta.url);

for (const buildConfigs of CONFIG_BUILDERS) {
  for (const config of buildConfigs()) {
    await writeRulesFile(config.rules, new URL(config.fileName, distDir), config.source);
  }
}
