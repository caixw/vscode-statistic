// SPDX-License-Identifier: MIT

import * as assert from 'assert';
import * as line from '../../../line/line';
import * as lang from '../../../line/lang';

interface CountContentData {
    input: string;
    output: line.Lines;
}

suite('Line test suite', () => {
    test('countContent', () => {
        const data: CountContentData[] = [
            {
                input: 'c = 1+2',
                output: {
                    name: '.c',
                    lines: 1,
                    blanks: 0,
                    comments: 0,
                }
            },
            {
                input: 'c = 1+2//comment',
                output: {
                    name: '.c',
                    lines: 1,
                    blanks: 0,
                    comments: 1,
                }
            },
            {
                input: 'c = 1+2//comment\n',
                output: {
                    name: '.c',
                    lines: 2,
                    blanks: 1,
                    comments: 1,
                }
            },
            {
                input: 'c = 1+2/*comment*/\n',
                output: {
                    name: '.c',
                    lines: 2,
                    blanks: 1,
                    comments: 1,
                }
            },
            { // 字符串包含注释
                input: 'c = "/*test"\n',
                output: {
                    name: '.c',
                    lines: 2,
                    blanks: 1,
                    comments: 0,
                }
            },
            { // 字符串包含注释
                input: 'c = "/*test*/"\n',
                output: {
                    name: '.c',
                    lines: 2,
                    blanks: 1,
                    comments: 0,
                }
            },
            { // 没有指定结束符
                input: 'c = 1+2/*comment\n\n\n',
                output: {
                    name: '.c',
                    lines: 4,
                    blanks: 3,
                    comments: 4,
                }
            },
            {
                input: 'c = 1+2/*comment\n\n*/\n',
                output: {
                    name: '.c',
                    lines: 4,
                    blanks: 2,
                    comments: 3,
                }
            },
            {
                input: 'c = 1+2/*comment\n\n*/\n//123\n',
                output: {
                    name: '.c',
                    lines: 5,
                    blanks: 2,
                    comments: 4,
                }
            },
        ];

        for (const index in data) {
            const item = data[index];
            const i = item.input;
            const o = item.output;
            const block = lang.find(o.name);

            if (block === undefined) {
                assert.ok(false, `block===undefined at ${index}`);
            } else {
                assert.deepStrictEqual(line.countContent(o.name, i, block), o, `not equal @ ${index}`);
            }
        }
    });
});
