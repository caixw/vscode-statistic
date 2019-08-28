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
const pkg = require(path.resolve(rootDir, 'package.json'));

/**
 * 保存从参数中获取的值信息
 */
class Options {
    stable: boolean;
    minimum: boolean;
    insiders: boolean;

    constructor(val: boolean) {
        this.stable = val;
        this.minimum = val;
        this.insiders = val;
    }
}

async function main() {
    const o = parseArgs();

    try {
        // 测试当前版本
        if (o.stable) {
            await runTests({
                extensionDevelopmentPath: rootDir,
                extensionTestsPath,
                version: 'stable',
                launchArgs: [rootDir],
            });
        }

        // 测试最低需求的版本
        if (o.minimum) {
            let minimum = pkg.engines.vscode.slice(1);
            if (isNaN(minimum.charAt(0))) {
                minimum = minimum.slice(1);
            }
            await runTests({
                extensionDevelopmentPath: rootDir,
                extensionTestsPath,
                version: minimum,
                launchArgs: [rootDir],
            });
        }

        // 测试 insiders 版本
        if (o.insiders) {
            await runTests({
                extensionDevelopmentPath: rootDir,
                extensionTestsPath,
                version: 'insiders',
                launchArgs: [rootDir],
            });
        }
    } catch (err) {
        throw err;
    }
}

function parseArgs(): Options {
    // 当前是从 npm script 中过来的，所以前两个参数需要过滤
    const args = process.argv.slice(2);
    if (args.length === 0) {
        return new Options(true);
    }

    let o = new Options(false);
    const keys = args[0].split(',');
    for (const key of keys) {
        switch (key.toLowerCase()) {
            case 'stable':
                o.stable = true;
                break;
            case 'minimum':
                o.minimum = true;
                break;
            case 'insiders':
                o.insiders = true;
                break;
            default:
                throw new Error(`无效的参数值${key}`);
        }
    }
    return o;
}

main().catch((reason) => {
    console.error(reason);
    process.exit(1);
});
