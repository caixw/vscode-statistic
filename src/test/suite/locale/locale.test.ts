// SPDX-License-Identifier: MIT

import * as assert from 'assert';
import { init, l, id } from "../../../locale/locale";
import { en } from '../../../locale/en';
import { zhCN } from '../../../locale/zh-cn';

suite('Locale test suite', () => {
    test('locale en', () => {
        setLocale('en');
        init();
        assert.strictEqual('en', id());
        assert.strictEqual(l('name'), en.name);
    });

    test('locale zh-cn', () => {
        setLocale('zh-cn');
        init();
        assert.strictEqual('zh-cn', id());
        assert.strictEqual(l('name'), zhCN.name);
        assert.strictEqual(l('__not_exists__'), '__not_exists__');
    });

    test('locale zh', () => {
        setLocale('zh');
        init();
        assert.strictEqual('zh', id());
        assert.strictEqual(l('name'), zhCN.name);
        assert.strictEqual(l('__not_exists__'), '__not_exists__');
    });
});

function setLocale(id: string): void {
    process.env.VSCODE_NLS_CONFIG = JSON.stringify({
        locale: id,
    });
}
