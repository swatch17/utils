import { defineConfig } from 'rollup';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import createBanner from 'create-banner';
import * as changeCase from 'change-case';
import pkg from './package.json' assert { type: 'json' };
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';

// const pkg = require("./package");

const name = changeCase.pascalCase(pkg.name.replace('@deann/', ''));

const banner = createBanner({
  data: {
    name: `${name}.js`,
    year: new Date().getFullYear(),
  },
});

export default defineConfig({
  input: './src/main.ts',
  output: [
    {
      banner,
      file: 'dist/index.js',
      format: 'umd',
      name: 'utils',
      globals: { 'lodash-es/isString': 'lodash-es' },
      sourcemap: true,
      globals: { dayjs: 'dayjs' },
    },
    {
      file: 'dist/index.min.js',
      format: 'esm',
      sourcemap: true,
      plugins: [terser()],
      globals: { dayjs: 'dayjs' },
    },
  ],

  plugins: [
    commonjs({
      strictRequires: true,
      exclude: 'node_modules/**',
      include: ['src/**/*.js', 'lib/**/*.js', '/node_modules/'],
      requireReturnsDefault: 'auto',
      transformMixedEsModules: true,
    }),
    typescript({ sourceMap: true }),
    babel({ babelHelpers: 'bundled' }),
    nodeResolve({
      browser: true,
      moduleDirectories: ['node_modules'],
    }),
    json(),
  ],
  external: ['lodash-es', 'dayjs'],
});
