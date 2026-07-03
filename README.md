# @jay-es/oxlint-config

Ready-to-use [oxlint](https://oxc.rs/docs/guide/usage/linter.html) configs generated from popular ESLint configs (`@eslint/js`, `typescript-eslint`, ...), filtered down to only the rules oxlint actually supports.

Each source config is mechanically filtered against oxlint's own [configuration schema](https://github.com/oxc-project/oxc/blob/main/npm/oxlint/configuration_schema.json), so unsupported rules are dropped and rule names are rewritten to oxlint's naming convention (e.g. `@typescript-eslint/no-explicit-any` → `typescript/no-explicit-any`).

## Usage

Each config is published as a subpath export. Import the `rules` object and spread it into your `.oxlintrc.json` (or `oxlint.config.ts`) `rules` field.

```ts
import { rules as recommended } from "@jay-es/oxlint-config/eslint-recommended";
import { rules as tsRecommended } from "@jay-es/oxlint-config/typescript-recommended";

export default {
  rules: {
    ...recommended,
    ...tsRecommended,
  },
};
```

## Available configs

### [`@eslint/js`](https://www.npmjs.com/package/@eslint/js)

| Config               | Source                                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| `eslint-recommended` | [`recommended`](https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-recommended.js) |
| `eslint-all`         | [`all`](https://github.com/eslint/eslint/blob/main/packages/js/src/configs/eslint-all.js)                 |

### [`typescript-eslint`](https://typescript-eslint.io/users/configs/)

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

More plugins (react-hooks, import, unicorn, ...) are planned.

## Advanced: building your own filtered config

If you want to filter a config from a plugin this package doesn't cover yet, you can use the exported utilities directly:

```ts
import { filterSupportedRules, mergeFlatConfigRules } from "@jay-es/oxlint-config";

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
