/*
 * @Author: zyl 863344241@qq.com
 * @Date: 2024-09-20 10:28:04
 * @LastEditors: zyl 863344241@qq.com
 * @LastEditTime: 2024-09-20 11:03:55
 * @FilePath: /web-zhuawa/zyl-cli/packages/fs-lint/src/lints/eslint/getESLintConfigType.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import glob from 'glob';
import type { PKG } from '../../types';

/**
 * 获取 ESLint 配置类型
 * @param cwd
 * @param pkg
 * @returns eslint-config/index
 * @returns eslint-config/react
 * @returns eslint-config/typescript/index
 * @returns eslint-config/typescript/react
 */
export function getESLintConfigType(cwd: string, pkg: PKG): string {
  const tsFiles = glob.sync('./!(node_modules)/**/*.@(ts|tsx)', { cwd });
  const reactFiles = glob.sync('./!(node_modules)/**/*.@(jsx|tsx)', { cwd });
  const vueFiles = glob.sync('./!(node_modules)/**/*.vue', { cwd });
  const dependencies = Object.keys(pkg.dependencies || {});
  const language = tsFiles.length > 0 ? 'typescript' : '';
  let dsl = '';

  // dsl判断
  if (reactFiles.length > 0 || dependencies.some((name) => /^react(-|$)/.test(name))) {
    dsl = 'react';
  } else if (vueFiles.length > 0 || dependencies.some((name) => /^vue(-|$)/.test(name))) {
    dsl = 'vue';
  } else if (dependencies.some((name) => /^rax(-|$)/.test(name))) {
    dsl = 'rax';
  }

  return (
    'eslint-config/' + `${language}/${dsl}`.replace(/\/$/, '/index').replace(/^\//, '')
  );
}
