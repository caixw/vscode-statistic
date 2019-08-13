// SPDX-License-Identifier: MIT

import * as vscode from 'vscode';
import { workspace as ws } from 'vscode';
import * as locale from './locale';
import * as webview from './webview';

// 初始化本地化信息
locale.init();

export function activate(ctx: vscode.ExtensionContext) {
    const cmdName = 'caixw.statistic.show';
    const show = vscode.commands.registerCommand(cmdName, (uri: any) => {
        registerCommand(ctx, uri);
    });

    ctx.subscriptions.push(show);
}

export function deactivate() { }

function registerCommand(ctx: vscode.ExtensionContext, uri: any) {
    if (uri !== undefined) {
        createView(ctx, uri as vscode.Uri);
        return;
    }

    // 未选择项目，可能是通过命令面板执行的，执行以下操作。
    
    if (undefined === ws.workspaceFolders) {
        showError('none-project-open');
        return;
    }

    vscode.window.showWorkspaceFolderPick().then((v) => {
        if (undefined === v) {
            showError('none-project-selected');
            return;
        }

        createView(ctx, v.uri);
    });
}

function createView(ctx: vscode.ExtensionContext, uri: vscode.Uri) {
    const folder = ws.getWorkspaceFolder(uri);
    if (folder === undefined) {
        showError('none-project-selected');
        return;
    }

    try {
        webview.create(ctx, folder);
    } catch (e) {
        vscode.window.showErrorMessage(e);
    }
}

function showError(id: string) {
    vscode.window.showErrorMessage(locale.l(id));
}
