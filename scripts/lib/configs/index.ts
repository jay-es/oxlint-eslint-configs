import type { ConfigBuilder } from "../generated-config.ts";
import { buildEslintJsConfigs } from "./eslint-js.ts";
import { buildEslintPluginUnicornConfigs } from "./eslint-plugin-unicorn.ts";
import { buildTypescriptEslintConfigs } from "./typescript-eslint.ts";

// 新しいプラグインに対応する場合は、ここに config builder を追加するファイルを作り、
// この配列に登録する。
export const CONFIG_BUILDERS: ConfigBuilder[] = [
  buildEslintJsConfigs,
  buildTypescriptEslintConfigs,
  buildEslintPluginUnicornConfigs,
];
