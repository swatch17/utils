import { defineConfig } from 'rollup';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import createBanner from 'create-banner';
import * as changeCase from 'change-case';
import pkg from './package.json' assert { type: 'json' };
import typescript from '@rollup/plugin-typescript';


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
    },
    {
      file: 'dist/index.min.js',
      format: 'esm',
      plugins: [terser()],
    },
  ],

  plugins: [
    json(),
    commonjs({
      strictRequires: true,
      exclude: 'node_modules/**',
      include: ['src/**/*.js', 'lib/**/*.js'],
    }),
    typescript(),
  ],
  // external: ['lodash-es']
});
