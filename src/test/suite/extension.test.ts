// SPDX-License-Identifier: MIT

import * as assert from 'assert';
import * as vscode from 'vscode';
import * as webview from '../../webview';

const id = 'caixw.statistic';
const cmd = 'caixw.statistic.show';

suite('Extension test suite', () => {
    test('extension', async () => {
        const ext = getExtension();

        await ext.activate();
        assert.ok(ext.isActive);
        assert.strictEqual(ext.id, id);
    });

    test(`exec command ${cmd}`, async () => {
        assert.strictEqual(0, webview.length());

        // 打开了一个 webview
        await vscode.commands.executeCommand(cmd);
        await sleep(500);
        assert.strictEqual(1, webview.length());

        // 多次执行并不会打开多个
        await vscode.commands.executeCommand(cmd);
        await sleep(500);
        assert.strictEqual(1, webview.length());
    });
});

function getExtension(): vscode.Extension<any> {
    const ext = vscode.extensions.getExtension(id);
    assert.notStrictEqual(undefined, ext);
    return ext as vscode.Extension<any>;
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
