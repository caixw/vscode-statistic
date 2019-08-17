// SPDX-License-Identifier: MIT

import * as assert from 'assert';
import { None } from '../../../vcs/none';

suite('Test None suite', () => {
    test('None', () => {
        const none = new None('./testdata');
        assert.strictEqual(none.name, 'None');
        none.files().then((files: Array<string>) => {
            assert.strictEqual(3, files.length);
        });
    });
});
