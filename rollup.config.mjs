import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import { createRequire } from 'node:module';

// This is required to read package.json file when
// using Native ES modules in Node.js
const requireFile = createRequire(import.meta.url);
const packageJson = requireFile('./package.json');

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main, // CJS output
        format: 'cjs',
        sourcemap: true,
        inlineDynamicImports: true,
      },
      {
        file: packageJson.module, // ESM output
        format: 'esm',
        sourcemap: true,
        inlineDynamicImports: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript(), // Ensure tsconfig.json targets ESM
      postcss({
        extensions: ['.scss'],
      }),
      react(),
      svgrPlugin({
        svgrOptions: {
          icon: true,
        },
      }),
    ],
  },
  {
    input: 'lib/index.d.ts',
    output: [
      { file: 'lib/index.d.ts', format: 'es', inlineDynamicImports: true },
    ],
    plugins: [dts()],
    external: [/\.scss$/],
  },
];
