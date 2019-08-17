// SPDX-License-Identifier: MIT

import * as assert from 'assert';
import { init, l, id } from "../../../locale/locale";
import { en } from '../../../locale/en';
import { zhCN } from '../../../locale/zh-cn';

suite('Locale test suite', () => {
    test('locale', () => {
        setLocale('en');
        init();
        assert.strictEqual('en', id());
        assert.strictEqual(l('name'), en.name);


        setLocale('zh-cn');
        init();
        assert.strictEqual('zh-cn', id());
        assert.strictEqual(l('name'), zhCN.name);
    });
});

function setLocale(id: string): void {
    process.env.VSCODE_NLS_CONFIG = JSON.stringify({
        locale: id,
    });
}
