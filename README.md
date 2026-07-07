# @jay-es/oxlint-eslint-configs

Ready-to-use [oxlint](https://oxc.rs/docs/guide/usage/linter.html) configs generated from popular ESLint configs (`@eslint/js`, `typescript-eslint`, ...), filtered down to only the rules oxlint actually supports.

Each source config is mechanically filtered against oxlint's own [configuration schema](https://github.com/oxc-project/oxc/blob/main/npm/oxlint/configuration_schema.json), so unsupported rules are dropped and rule names are rewritten to oxlint's naming convention (e.g. `@typescript-eslint/no-explicit-any` → `typescript/no-explicit-any`).

## Usage

Each config is published as a subpath export. Import the `rules` object and spread it into your `.oxlintrc.json` (or `oxlint.config.ts`) `rules` field.

```ts
import { rules as recommended } from "@jay-es/oxlint-eslint-configs/eslint-recommended";
import { rules as tsRecommended } from "@jay-es/oxlint-eslint-configs/typescript-recommended";

export default {
  rules: {
    ...recommended,
    ...tsRecommended,
  },
};
```

## Available configs

This covers every plugin in oxlint's [Supported plugins](https://oxc.rs/docs/guide/usage/linter/plugins.html#supported-plugins)
list except `oxc`, which has no upstream ESLint config to port from (it's oxlint's own rule set).

### `eslint` ([`@eslint/js`](https://www.npmjs.com/package/@eslint/js))

| Config               | Source                                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| `eslint-recommended` | [`recommended`](https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-recommended.js) |
| `eslint-all`         | [`all`](https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-all.js)                 |

### `typescript` ([`typescript-eslint`](https://typescript-eslint.io/users/configs/))

| Config                                     | Source                                                                                                    |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `typescript-eslint-recommended`            | [`eslintRecommended`](https://typescript-eslint.io/users/configs/#eslint-recommended)                     |
| `typescript-recommended`                   | [`recommended`](https://typescript-eslint.io/users/configs/#recommended)                                  |
| `typescript-recommended-type-checked`      | [`recommendedTypeChecked`](https://typescript-eslint.io/users/configs/#recommended-type-checked)          |
| `typescript-recommended-type-checked-only` | [`recommendedTypeCheckedOnly`](https://typescript-eslint.io/users/configs/#recommended-type-checked-only) |
| `typescript-strict`                        | [`strict`](https://typescript-eslint.io/users/configs/#strict)                                            |
| `typescript-strict-type-checked`           | [`strictTypeChecked`](https://typescript-eslint.io/users/configs/#strict-type-checked)                    |
| `typescript-strict-type-checked-only`      | [`strictTypeCheckedOnly`](https://typescript-eslint.io/users/configs/#strict-type-checked-only)           |
| `typescript-stylistic`                     | [`stylistic`](https://typescript-eslint.io/users/configs/#stylistic)                                      |
| `typescript-stylistic-type-checked`        | [`stylisticTypeChecked`](https://typescript-eslint.io/users/configs/#stylistic-type-checked)              |
| `typescript-stylistic-type-checked-only`   | [`stylisticTypeCheckedOnly`](https://typescript-eslint.io/users/configs/#stylistic-type-checked-only)     |
| `typescript-all`                           | [`all`](https://typescript-eslint.io/users/configs/#all)                                                  |
| `typescript-disable-type-checked`          | [`disableTypeChecked`](https://typescript-eslint.io/users/configs/#disable-type-checked)                  |

### `unicorn` ([`eslint-plugin-unicorn`](https://github.com/sindresorhus/eslint-plugin-unicorn#preset-configs-))

| Config                  | Source                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| `unicorn-recommended`   | [`recommended`](https://github.com/sindresorhus/eslint-plugin-unicorn#preset-configs-)   |
| `unicorn-unopinionated` | [`unopinionated`](https://github.com/sindresorhus/eslint-plugin-unicorn#preset-configs-) |
| `unicorn-all`           | [`all`](https://github.com/sindresorhus/eslint-plugin-unicorn#preset-configs-)           |

### `react` ([`eslint-plugin-react`](https://github.com/jsx-eslint/eslint-plugin-react))

| Config              | Source                                                                         |
| ------------------- | ------------------------------------------------------------------------------ |
| `react-recommended` | [`recommended`](https://github.com/jsx-eslint/eslint-plugin-react#recommended) |
| `react-all`         | [`all`](https://github.com/jsx-eslint/eslint-plugin-react#all)                 |

### `react-perf` ([`eslint-plugin-react-perf`](https://github.com/cvazac/eslint-plugin-react-perf))

| Config                   | Source        |
| ------------------------ | ------------- |
| `react-perf-recommended` | `recommended` |
| `react-perf-all`         | `all`         |

### `nextjs` ([`@next/eslint-plugin-next`](https://nextjs.org/docs/app/api-reference/config/eslint))

Rule keys are registered under the `@next/next` plugin name, which are renamed to the
`nextjs/` prefix oxlint uses.

| Config                   | Source                                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------------- |
| `nextjs-recommended`     | [`recommended`](https://nextjs.org/docs/app/api-reference/config/eslint#recommended-plugin-ruleset) |
| `nextjs-core-web-vitals` | [`core-web-vitals`](https://nextjs.org/docs/app/api-reference/config/eslint#core-web-vitals)        |

### `import` ([`eslint-plugin-import-x`](https://github.com/un-ts/eslint-plugin-import-x))

oxlint only has an `import/` namespace (no `import-x/`), so these are sourced from the
better-maintained `eslint-plugin-import-x` and its rules are renamed to the `import/` prefix.

| Config               | Source                                                                       |
| -------------------- | ---------------------------------------------------------------------------- |
| `import-recommended` | [`recommended`](https://github.com/un-ts/eslint-plugin-import-x#recommended) |
| `import-errors`      | [`errors`](https://github.com/un-ts/eslint-plugin-import-x#errors)           |
| `import-warnings`    | [`warnings`](https://github.com/un-ts/eslint-plugin-import-x#warnings)       |
| `import-stage-0`     | [`stage-0`](https://github.com/un-ts/eslint-plugin-import-x#stage-0)         |
| `import-typescript`  | [`typescript`](https://github.com/un-ts/eslint-plugin-import-x#typescript)   |

### `jsdoc` ([`eslint-plugin-jsdoc`](https://github.com/gajus/eslint-plugin-jsdoc))

eslint-plugin-jsdoc ships many near-duplicate presets (combinations of contents/logical/
requirements/stylistic with typescript/tsdoc flavors and error variants). Only the three
below differ meaningfully after filtering down to the rules oxlint supports.

| Config                         | Source                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------ |
| `jsdoc-recommended`            | [`recommended`](https://github.com/gajus/eslint-plugin-jsdoc#recommended)            |
| `jsdoc-recommended-error`      | [`recommended-error`](https://github.com/gajus/eslint-plugin-jsdoc#recommended)      |
| `jsdoc-recommended-typescript` | [`recommended-typescript`](https://github.com/gajus/eslint-plugin-jsdoc#recommended) |

### `jsx-a11y` ([`eslint-plugin-jsx-a11y`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y))

| Config                 | Source                                                                      |
| ---------------------- | --------------------------------------------------------------------------- |
| `jsx-a11y-recommended` | [`recommended`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y#usage) |
| `jsx-a11y-strict`      | [`strict`](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y#usage)      |

### `node` ([`eslint-plugin-n`](https://github.com/eslint-community/eslint-plugin-n))

| Config                    | Source                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------ |
| `node-recommended-module` | [`recommended-module`](https://github.com/eslint-community/eslint-plugin-n#-configs) |
| `node-recommended-script` | [`recommended-script`](https://github.com/eslint-community/eslint-plugin-n#-configs) |
| `node-all`                | [`flat/all`](https://github.com/eslint-community/eslint-plugin-n#-configs)           |

### `promise` ([`eslint-plugin-promise`](https://github.com/eslint-community/eslint-plugin-promise))

| Config                | Source                                                                           |
| --------------------- | -------------------------------------------------------------------------------- |
| `promise-recommended` | [`recommended`](https://github.com/eslint-community/eslint-plugin-promise#usage) |

### `jest` ([`eslint-plugin-jest`](https://github.com/jest-community/eslint-plugin-jest))

| Config             | Source                                                                      |
| ------------------ | --------------------------------------------------------------------------- |
| `jest-recommended` | [`recommended`](https://github.com/jest-community/eslint-plugin-jest#rules) |
| `jest-style`       | [`style`](https://github.com/jest-community/eslint-plugin-jest#rules)       |
| `jest-all`         | [`all`](https://github.com/jest-community/eslint-plugin-jest#rules)         |

### `vitest` ([`@vitest/eslint-plugin`](https://github.com/vitest-dev/eslint-plugin-vitest))

| Config               | Source                                                                    |
| -------------------- | ------------------------------------------------------------------------- |
| `vitest-recommended` | [`recommended`](https://github.com/vitest-dev/eslint-plugin-vitest#rules) |
| `vitest-all`         | [`all`](https://github.com/vitest-dev/eslint-plugin-vitest#rules)         |

### `vue` ([`eslint-plugin-vue`](https://eslint.vuejs.org/rules/))

Non-flat configs (e.g. `recommended`) use `extends` to chain to earlier presets via file
paths, which isn't resolved when just reading `rules`. The `flat/` configs embed the full
chain as config array elements instead, so those are used here. Vue 2 presets (`vue2-*`)
are not included.

| Config                     | Source                                                                                                                                 |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `vue-essential`            | [`flat/essential`](https://eslint.vuejs.org/rules/#priority-a-essential-error-prevention)                                              |
| `vue-strongly-recommended` | [`flat/strongly-recommended`](https://eslint.vuejs.org/rules/#priority-b-strongly-recommended-improving-readability)                   |
| `vue-recommended`          | [`flat/recommended`](https://eslint.vuejs.org/rules/#priority-c-recommended-minimizing-arbitrary-choices-and-cognitive-overhead)       |
| `vue-recommended-error`    | [`flat/recommended-error`](https://eslint.vuejs.org/rules/#priority-c-recommended-minimizing-arbitrary-choices-and-cognitive-overhead) |

## Advanced: building your own filtered config

If you want to filter a config from a plugin this package doesn't cover yet, you can use the exported utilities directly:

```ts
import { filterSupportedRules, mergeFlatConfigRules } from "@jay-es/oxlint-eslint-configs";

// Works with a plain rules object...
const rules = filterSupportedRules({ "no-unused-vars": "error" });

// ...or an ESLint flat config array (rules are merged in order first).
const merged = mergeFlatConfigRules(someFlatConfigArray);
const filtered = filterSupportedRules(merged);
```

## Development

- Install dependencies:

```bash
pnpm install
```

- Regenerate the configs in `dist/`:

```bash
pnpm run generate
```

- Run the unit tests:

```bash
pnpm run test
```

- Build the library:

```bash
pnpm run build
```
