// SPDX-License-Identifier: MIT

import * as assert from 'assert';
import * as pascal from '../../../line/pascal';

suite('Pascal test suite', () => {
    test('Pascal string', () => {
        const b = new pascal.PascalString("'");

        // begin 不需要转义
        assert.strictEqual(b.begin("012"), 0);
        assert.strictEqual(b.begin("012'456"), 4);
        assert.strictEqual(b.begin("012''56'89"), 4);
        assert.strictEqual(b.begin("012'"), -1);

        assert.strictEqual(b.end("0123"), 0);
        assert.strictEqual(b.end("0123'"), -1);
        assert.strictEqual(b.end("0123'56"), 5);
        assert.strictEqual(b.end("0123''67'9"), 9);
        assert.strictEqual(b.end("0123''67'"), -1);
        assert.strictEqual(b.end("0123'''7"), 7);
        assert.strictEqual(b.end("'''34"), 3);
    });
});
