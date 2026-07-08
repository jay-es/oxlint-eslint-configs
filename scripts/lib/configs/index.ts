import type { ConfigBuilder } from "../generated-config.ts";
import { buildEslintJsConfigs } from "./eslint-js.ts";
import { buildEslintPluginImportXConfigs } from "./eslint-plugin-import-x.ts";
import { buildEslintPluginJestConfigs } from "./eslint-plugin-jest.ts";
import { buildEslintPluginJsdocConfigs } from "./eslint-plugin-jsdoc.ts";
import { buildEslintPluginJsxA11yConfigs } from "./eslint-plugin-jsx-a11y.ts";
import { buildEslintPluginNConfigs } from "./eslint-plugin-n.ts";
import { buildEslintPluginNextConfigs } from "./eslint-plugin-next.ts";
import { buildEslintPluginPromiseConfigs } from "./eslint-plugin-promise.ts";
import { buildEslintPluginReactConfigs } from "./eslint-plugin-react.ts";
import { buildEslintPluginReactHooksConfigs } from "./eslint-plugin-react-hooks.ts";
import { buildEslintPluginReactPerfConfigs } from "./eslint-plugin-react-perf.ts";
import { buildEslintPluginReactRefreshConfigs } from "./eslint-plugin-react-refresh.ts";
import { buildEslintPluginUnicornConfigs } from "./eslint-plugin-unicorn.ts";
import { buildEslintPluginVitestConfigs } from "./eslint-plugin-vitest.ts";
import { buildEslintPluginVueConfigs } from "./eslint-plugin-vue.ts";
import { buildTypescriptEslintConfigs } from "./typescript-eslint.ts";

// oxlint の Supported plugins の並び順 (https://oxc.rs/docs/guide/usage/linter/plugins.html)
// に合わせて登録する。新しいプラグインに対応する場合は、ここに config builder を
// 追加するファイルを作り、この配列に登録する。
export const CONFIG_BUILDERS: ConfigBuilder[] = [
  buildEslintJsConfigs,
  buildTypescriptEslintConfigs,
  buildEslintPluginUnicornConfigs,
  buildEslintPluginReactConfigs,
  buildEslintPluginReactHooksConfigs,
  buildEslintPluginReactRefreshConfigs,
  buildEslintPluginReactPerfConfigs,
  buildEslintPluginNextConfigs,
  buildEslintPluginImportXConfigs,
  buildEslintPluginJsdocConfigs,
  buildEslintPluginJsxA11yConfigs,
  buildEslintPluginNConfigs,
  buildEslintPluginPromiseConfigs,
  buildEslintPluginJestConfigs,
  buildEslintPluginVitestConfigs,
  buildEslintPluginVueConfigs,
];
