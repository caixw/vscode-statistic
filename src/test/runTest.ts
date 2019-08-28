// SPDX-License-Identifier: MIT

import * as path from 'path';
import { runTests } from 'vscode-test';


// 项目的根目录。即 package.json 所在的目录
//
// 同时作为 extensionDevelopmentPath 参数使用；
// 同时还会将该目录的内容加载到启动的 vscode 测试用例中。
const rootDir = path.resolve(__dirname, '../../');

const extensionTestsPath = path.resolve(__dirname, './suite/index');

// 采用 require 可以避免 package.json 文件不在
// tsconfig.compilerOptions.rootDir 中的编译错误；
const pkg = require(path.resolve(rootDir,'package.json'));

async function main() {
    try {
        // 测试当前版本
        await runTests({
            extensionDevelopmentPath:rootDir,
            extensionTestsPath,
            version: 'stable',
            launchArgs: [rootDir],
        });

        // 测试最低需求的版本
        let minimum = pkg.engines.vscode.slice(1);
        if (isNaN(minimum.charAt(0))) {
            minimum = minimum.slice(1);
        }
        await runTests({
            extensionDevelopmentPath:rootDir,
            extensionTestsPath,
            version: minimum,
            launchArgs: [rootDir],
        });

        // 测试 insiders 版本
        await runTests({
            extensionDevelopmentPath:rootDir,
            extensionTestsPath,
            version: 'insiders',
            launchArgs: [rootDir],
        });
    } catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}

main();
