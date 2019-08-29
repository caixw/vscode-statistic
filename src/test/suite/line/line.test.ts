// SPDX-License-Identifier: MIT

import * as assert from 'assert';
import * as filesystem from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as line from '../../../line/line';
import * as lang from '../../../line/lang';

const fs = filesystem.promises;

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

    const dir = path.resolve(__dirname, 'testdata');
    const files = glob.sync(path.join(dir, 'file.*'));
    assert.ok(files.length > 0);

    for (const file of files) {
        const name = path.basename(file);
        test(`count ${name}`, async () => {
            const lines = await line.count(file);
            const result = await readResult(dir, name);
            assert.deepStrictEqual(lines, result, `${name}`);
        });
    }
});

async function readResult(dir: string, file: string): Promise<Object> {
    const p = path.join(dir, 'result', file + '.json');
    const content = await fs.readFile(p, { encoding: 'utf8', flag: 'r' });
    return JSON.parse(content);
}
