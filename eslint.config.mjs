import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextCoreWebVitals,
  {
    // Preserve the repository's pre-ESLint-9 policy while using Next 16's flat
    // config. The new preset enables these rules retroactively across legacy
    // copy and hook structure that this migration does not change.
    rules: {
      'react/no-unescaped-entities': 'off',
      'react-hooks/immutability': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'build/**',
    'node_modules/**',
    'spool-landing/**',
  ]),
]);
