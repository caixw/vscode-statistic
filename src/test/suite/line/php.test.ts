// SPDX-License-Identifier: MIT

import * as assert from 'assert';
import * as php from '../../../line/php';

suite('PHP test suite', () => {
    test('PHPDoc', () => {
        const b = new php.PHPDoc();

        assert.strictEqual(b.begin("012"), 0);
        assert.strictEqual(b.begin("012<<<"), 0);

        assert.strictEqual(b.begin("012<<<678"), -1);
        assert.strictEqual(b.end("123"), 0);
        assert.strictEqual(b.end("<<<678"), 0);
        assert.strictEqual(b.end("678"), -1);
        assert.strictEqual(b.end("678;"), -1);

        assert.strictEqual(b.begin("012<<<'678'"), -1);
        assert.strictEqual(b.end("678"), -1);
        assert.strictEqual(b.end("678;"), -1);

        assert.strictEqual(b.begin('012<<<"678"'), -1);
        assert.strictEqual(b.end("678"), -1);
        assert.strictEqual(b.end("678;"), -1);
    });
});
