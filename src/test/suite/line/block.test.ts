// SPDX-License-Identifier: MIT

import * as assert from 'assert';
import * as block from '../../../line/block';

suite('Block test suite', () => {
    test('String without escape 1', () => {
        const b = new block.String("'", "'");

        assert.strictEqual(b.begin("0123'56"), 5);
        assert.strictEqual(b.begin("0123"), 0);
        assert.strictEqual(b.begin("0123'"), -1);

        assert.strictEqual(b.end("0123'56"), 5);
        assert.strictEqual(b.end("0123'"), -1);
        assert.strictEqual(b.end("0123"), 0);
        assert.strictEqual(b.end("0123''6"), 5);
    });

    test('String without escape 2', () => {
        const b = new block.String("''", "''");

        assert.strictEqual(b.begin("0123''67"), 6);
        assert.strictEqual(b.begin("0123"), 0);
        assert.strictEqual(b.begin("0123''"), -1);

        assert.strictEqual(b.end("0123''67"), 6);
        assert.strictEqual(b.end("0123''"), -1);
        assert.strictEqual(b.end("0123"), 0);
        assert.strictEqual(b.end("0123'''7"), 6);
        assert.strictEqual(b.end("0123''''8"), 6);
    });

    test('String with escape 1', () => {
        const b = new block.String("'", "'", '/');

        // begin 不受影响
        assert.strictEqual(b.begin("012/'56"), 5);
        assert.strictEqual(b.begin("012/'"), -1);
        assert.strictEqual(b.begin("012/"), 0);

        // end 受 escape 影响
        assert.strictEqual(b.end("012/'56'89"), 8);
        assert.strictEqual(b.end("012/'56'8"), 8);
        assert.strictEqual(b.end("012/'56'"), -1);
        assert.strictEqual(b.end("012/''67'9"), 6);
        assert.strictEqual(b.end("012/'56"), 0);
        assert.strictEqual(b.end("012/t'67"), 6);
    });

    test('String with escape 2', () => {
        const b = new block.String("''", "''", '/');
        // begin 不受影响
        assert.strictEqual(b.begin("012/''67"), 6);
        assert.strictEqual(b.begin("012/''"), -1);
        assert.strictEqual(b.begin("012/"), 0);

        // end 受 escape 影响
        assert.strictEqual(b.end("012/''67''01"), 10);
        assert.strictEqual(b.end("012/''67''01"), 10);
        assert.strictEqual(b.end("012/''67''"), -1);
        assert.strictEqual(b.end("012/'''78''1"), 7);
        assert.strictEqual(b.end("012/''67"), 0);
        assert.strictEqual(b.end("012/t''78"), 7);
    });

    test('SignalComment', () => {
        let c = new block.SignalComment("#");

        assert.strictEqual(c.begin("#123"), 1);
        assert.strictEqual(c.begin("0123#567"), 5);
        assert.strictEqual(c.begin("01234567"), 0);
        assert.strictEqual(c.begin("0123456#"), -1);

        assert.strictEqual(c.end("#123"), -1);
        assert.strictEqual(c.end("0123#567"), -1);
    });

    test('MultipleComment', () => {
        let c = new block.MultipleComment("/*", "*/");

        assert.strictEqual(c.begin("/*234"), 2);
        assert.strictEqual(c.begin("012/*567"), 5);
        assert.strictEqual(c.begin("012/**67"), 5);
        assert.strictEqual(c.begin("012"), 0);
        assert.strictEqual(c.begin("012/*"), -1);

        assert.strictEqual(c.end("/*234*/78"), 7);
        assert.strictEqual(c.end("01*/45"), 4);
        assert.strictEqual(c.end("01*/"), -1);
        assert.strictEqual(c.end("*/23"), 2);
        assert.strictEqual(c.end("0123"), 0);
    });
});
