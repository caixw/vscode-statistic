// SPDX-License-Identifier: MIT

import * as assert from 'assert';
import * as nest from '../../../line/nest';

suite('Nest test suite', () => {
    test('NestComment 1', () => {
        const b = new nest.MultipleComment("/*", "*/");

        assert.strictEqual(b.begin("012"), 0);
        assert.strictEqual(b.begin("012/*56"), 5);
        assert.strictEqual(b.end("012*/56"), 5);
    });

    test('NestComment 2', () => {
        const b = new nest.MultipleComment("/*", "*/");

        assert.strictEqual(b.begin("012"), 0);
        assert.strictEqual(b.begin("012/*56"), 5);
        assert.strictEqual(b.end("012/*5*/8"), 0); // 未找到
        assert.strictEqual(b.depth, 0);
        assert.strictEqual(b.end("012*/"), -1);
    });

    test('NestComment 3', () => {
        const b = new nest.MultipleComment("/*", "*/");

        assert.strictEqual(b.begin("012"), 0);
        assert.strictEqual(b.begin("012/*56"), 5);
        assert.strictEqual(b.end("0/*3*/6*/9"), 9);
        assert.strictEqual(b.depth, 0);
    });

    test('NestComment 4', () => {
        const b = new nest.MultipleComment("/*", "*/");

        assert.strictEqual(b.begin("01/*45"), 4);
        assert.strictEqual(b.end("01/*/**/*/*/12"), 12);
        assert.strictEqual(b.depth, 0);
    });

    test('NestComment 5', () => {
        const b = new nest.MultipleComment("/*", "*/");

        assert.strictEqual(b.begin("01/*45"), 4);
        assert.strictEqual(b.end("01/*/*/78"), 0); // 不存在
        assert.strictEqual(b.depth, 2);
    });
});
