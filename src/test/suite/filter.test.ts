// SPDX-License-Identifier: MIT

import * as assert from 'assert';
import {filter} from "../../filter";

suite("Filter test suite", ()=>{
    test("filter", ()=>{
        let data:FilterTestItem[] = [
            {
                input:['a.cc','a.h'],
                output:['a.cc','a.h'],
            },
            { // LICENSE 在 textExt 中
                input:['a.cc','a.h', 'LICENSE'],
                output:['a.cc','a.h', 'LICENSE'],
            },
            { // .exe 在 ignoreExt 中
                input:['a.cc','a.h', 'LICENSE', 'a.exe'],
                output:['a.cc','a.h', 'LICENSE'],
            },
            { // woff 不属于 mimetype 中的 text/ 类型
                input:['a.cc','a.h', 'a.woff'],
                output:['a.cc','a.h'],
            },
            { // 不属于任何一条件中，则当作正常的
                input:['a.cc','a.h', 'NOT_IN_ALL'],
                output:['a.cc','a.h', 'NOT_IN_ALL'],
            },
            { // .swp 属于 ignore
                input:['a.cc','a.h', 'a.swp'],
                output:['a.cc','a.h'],
            },
        ];
        
        data.forEach((v,k)=>{
            assert.deepStrictEqual(filter(v.input), v.output,`第 ${k} 个元素测试错误`);
        });
    });
});

interface FilterTestItem {
    input: string[];
    output: string[];
    name?: string;
}
