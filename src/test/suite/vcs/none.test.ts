// SPDX-License-Identifier: MIT

import * as assert from 'assert';
import * as path from 'path';
import { None } from '../../../vcs/none';

suite('Test None suite', () => {
    test('None', async () => {
        const none = new None(path.resolve(__dirname,'./testdata'));
        assert.strictEqual(none.name, 'None');

        const files = await none.files();
        assert.strictEqual(3, files.length);
    });
});
