// SPDX-License-Identifier: MIT

import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension test suite', () => {
    test('extension', async () => {
        const ext = getExtension();

        await ext.activate();
        assert.ok(ext.isActive);
    });

    test('command caixw.statistic', async () => {
        await vscode.commands.executeCommand('caixw.statistic.show');
        // TODO
    });
});

function getExtension(): vscode.Extension<any> {
    const ext = vscode.extensions.getExtension('caixw.statistic');
    assert.notStrictEqual(undefined, ext);
    return ext as vscode.Extension<any>;
}
