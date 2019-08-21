// SPDX-License-Identifier: MIT

import * as vscode from 'vscode';
import { workspace as ws } from 'vscode';
import * as locale from './locale/locale';
import * as webview from './webview';

// 不需要 asar 的支持，需要在项目入口处处理 asar 的问题。
//
// https://electronjs.org/docs/tutorial/application-packaging#treating-an-asar-archive-as-a-normal-file
(process as any).noAsar = true;

// 初始化本地化信息
locale.init();

export function activate(ctx: vscode.ExtensionContext) {
    const cmdName = 'caixw.statistic.show';
    const show = vscode.commands.registerCommand(cmdName, (uri: any) => {
        commandShow(ctx, uri).catch((reason)=>{
            vscode.window.showErrorMessage(reason);
        });
    });

    ctx.subscriptions.push(show);
}

export function deactivate() { }

/**
 * caixw.statistic.show 命令的实际执行函数
 *
 * @param ctx 扩展的上下文环境
 * @param uri 当前操作所在的 uri，如果不存在，则为 undefined
 */
async function commandShow(ctx: vscode.ExtensionContext, uri: any) {
    if (uri !== undefined) {
        await webview.create(ctx, uri as vscode.Uri);
        return;
    }

    // 未选择项目，可能是通过命令面板执行的，执行以下操作。

    if (undefined === ws.workspaceFolders) {
        vscode.window.showErrorMessage(locale.l('none-project-open'));
        return;
    }

    const selected = await vscode.window.showWorkspaceFolderPick();
    if (undefined === selected) { // 取消操作
        return;
    }
    webview.create(ctx, selected.uri);
}
