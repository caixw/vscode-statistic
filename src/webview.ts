// SPDX-License-Identifier: MIT

import * as vscode from 'vscode';
import * as path from 'path';
import * as locale from './locale/locale';
import * as filesystem from 'fs';
import * as project from './project';

const fs = filesystem.promises;

// 保存已打开的视图面板实例，防止得复打开。
const views = new Map<string, vscode.WebviewPanel>();

/**
 * 创建 webview 页面
 */
export async function create(ctx: vscode.ExtensionContext, uri: vscode.Uri) {
    const folder = vscode.workspace.getWorkspaceFolder(uri);
    if (folder === undefined) {
        vscode.window.showErrorMessage(locale.l('none-project-selected'));
        return;
    }

    let view = views.get(folder.name);
    if (view !== undefined) {
        view.reveal(vscode.ViewColumn.One);
        return;
    }

    view = vscode.window.createWebviewPanel(
        'statistic',
        folder.name + ' : ' + locale.l('statistic'),
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
        }
    );

    const lightIcon = path.join(ctx.extensionPath, "resources", "icon.svg");
    const darkIcon = path.join(ctx.extensionPath, "resources", "icon.svg");
    view.iconPath = {
        light: vscode.Uri.file(lightIcon),
        dark: vscode.Uri.file(darkIcon),
    };

    const p = new project.Project(folder.uri.path);
    view.webview.html = await build(ctx, p.name);

    const types=await p.types();
    view.webview.postMessage({
        type: project.MessageType.file,
        data:types,
    });

    view.onDidDispose(() => {
        view = undefined;
        views.delete(folder.name);
    }, null, ctx.subscriptions);

    views.set(folder.name, view);
}

/**
 * 生成完整的 HTML 内容
 */
async function build(ctx: vscode.ExtensionContext, name: string): Promise<string> {
    const htmlPath = buildResourceUri(ctx, 'resources', 'view.html').fsPath;
    const html = await fs.readFile(htmlPath, { encoding: 'utf8' });

    return html.replace(/v\((.+?)\)/g, (m, $1) => {
        switch ($1) {
            case 'name':
                return name;
            case 'locale':
                return locale.id();
            default:
                return 'undefined';
        }
    }).replace(/l\((.+?)\)/g, (m, $1) => {
        return locale.l($1);
    });
}

function buildResourceUri(ctx: vscode.ExtensionContext, ...paths: Array<string>): vscode.Uri {
    const p = path.join(ctx.extensionPath, ...paths);
    return vscode.Uri.file(p).with({ scheme: 'vscode-resource' });
}
