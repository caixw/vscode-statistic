// SPDX-License-Identifier: MIT

import * as assert from 'assert';
import { isIgnore } from "../../../vcs/filter";

suite("Filter test suite", () => {
    test("isIgnore", () => {
        let data: FilterTestItem[] = [
            {
                input: 'a.cc',
                output: false,
            },
            { // LICENSE 在 textExt 中
                input: 'dir/LICENSE',
                output: false,
            },
            { // .exe 在 ignoreExt 中
                input: '/path/a.exe',
                output: true,
            },
            { // woff 不属于 mimetype 中的 text/ 类型
                input: 'a.woff',
                output: true,
            },
            { // 不属于任何一条件中，则当作正常的
                input: 'NOT_IN_ALL',
                output: false,
            },
            { // .swp 属于 ignore
                input: 'a.swp',
                output: true,
            },
        ];

        data.forEach((v, k) => {
            assert.strictEqual(isIgnore(v.input), v.output, `第 ${k}:${v.input} 个元素测试错误`);
        });
    });
});

interface FilterTestItem {
    input: string;
    output: boolean;
}
