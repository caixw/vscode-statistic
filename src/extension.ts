// SPDX-License-Identifier: MIT

import * as vscode from 'vscode';
import * as locale from './locale';
import * as webview from './webview';

// 初始化本地化信息
locale.init();

export function activate(ctx: vscode.ExtensionContext) {
    const cmdName = 'caixw.statistic.show';
    const show = vscode.commands.registerCommand(cmdName, (uri: any) => {
        const folder = vscode.workspace.getWorkspaceFolder(<vscode.Uri>uri);
        if (folder === undefined) {
            vscode.window.showErrorMessage(locale.l('none-project'));
            return;
        }

        try {
            webview.create(ctx, folder);
        } catch (e) {
            vscode.window.showErrorMessage(e);
        }
    });

    ctx.subscriptions.push(show);
}

export function deactivate() { }
