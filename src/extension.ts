// Copyright 2019 by caixw, All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import * as vscode from 'vscode';
import * as locale from './locale';
import * as webview from './webview';

// 初始化本地化信息
locale.init();

export function activate(ctx: vscode.ExtensionContext) {
    const cmdName = 'extension.statistic.show';
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
