// Bridge flat config to legacy .eslintrc.cjs using FlatCompat
const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

// `compat.config()` converts a legacy-style config object into a flat config
module.exports = compat.config(require('./.eslintrc.cjs'));
