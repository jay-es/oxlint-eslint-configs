import type { ConfigBuilder } from "../generated-config.ts";
import { buildEslintJsConfigs } from "./eslint-js.ts";
import { buildEslintPluginImportXConfigs } from "./eslint-plugin-import-x.ts";
import { buildEslintPluginNConfigs } from "./eslint-plugin-n.ts";
import { buildEslintPluginPromiseConfigs } from "./eslint-plugin-promise.ts";
import { buildEslintPluginUnicornConfigs } from "./eslint-plugin-unicorn.ts";
import { buildTypescriptEslintConfigs } from "./typescript-eslint.ts";

// 新しいプラグインに対応する場合は、ここに config builder を追加するファイルを作り、
// この配列に登録する。
export const CONFIG_BUILDERS: ConfigBuilder[] = [
  buildEslintJsConfigs,
  buildTypescriptEslintConfigs,
  buildEslintPluginUnicornConfigs,
  buildEslintPluginImportXConfigs,
  buildEslintPluginPromiseConfigs,
  buildEslintPluginNConfigs,
];
