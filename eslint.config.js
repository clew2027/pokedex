import { config as esinxConfig } from '@esinx/eslint-config';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...esinxConfig,
  {
    rules: {
      'no-console': 'off',
    },
  },
];