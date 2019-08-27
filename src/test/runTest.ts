import * as path from 'path';

import { runTests } from 'vscode-test';

// 采用 require 可以避免 package.json 文件不在
// tsconfig.compilerOptions.rootDir 中的编译错误；
const pkg = require('../../package.json');

async function main() {
    try {
        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        // The path to test runner
        // Passed to --extensionTestsPath
        const extensionTestsPath = path.resolve(__dirname, './suite/index');

        // 测试当前版本
        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
            version: 'stable',
            launchArgs: [extensionDevelopmentPath],
        });

        // 测试最低需求的版本
        let minimum = pkg.engines.vscode.slice(1);
        if (isNaN(minimum.charAt(0))) {
            minimum = minimum.slice(1);
        }
        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
            version: minimum,
            launchArgs: [extensionDevelopmentPath],
        });

        // 测试 insiders 版本
        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
            version: 'insiders',
            launchArgs: [extensionDevelopmentPath],
        });
    } catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}

main();
