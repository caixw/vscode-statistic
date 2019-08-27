// SPDX-License-Identifier: MIT

import * as assert from 'assert';
import * as vscode from 'vscode';

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
        await vscode.commands.executeCommand(cmd);
        // TODO
    });
});

function getExtension(): vscode.Extension<any> {
    const ext = vscode.extensions.getExtension(id);
    assert.notStrictEqual(undefined, ext);
    return ext as vscode.Extension<any>;
}
