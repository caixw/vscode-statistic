// SPDX-License-Identifier: MIT

import * as assert from 'assert';
import * as lang from '../../../line/lang';
import * as block from '../../../line/block';

suite('Lang test suite',()=>{
    test('find',()=>{
        assert.strictEqual(undefined, lang.find('not-exists'));

        assert.ok(lang.find('.c') !== undefined);
        assert.ok((lang.find('.cpp')as block.Block[]).length > 0);
        assert.strictEqual(lang.find('.c'),lang.find('.d'));
    });
});
