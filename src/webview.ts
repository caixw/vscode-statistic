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

    let panel = views.get(folder.name);
    if (panel !== undefined) {
        panel.reveal(vscode.ViewColumn.One);
        return;
    }

    panel = vscode.window.createWebviewPanel(
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
    panel.iconPath = {
        light: vscode.Uri.file(lightIcon),
        dark: vscode.Uri.file(darkIcon),
    };

    const p = new project.Project(folder.uri.path);
    panel.webview.html = await build(ctx, p.name);

    panel.webview.onDidReceiveMessage(async (e)=>{
        const msg = e as project.Message;

        switch(msg.type) {
            case project.MessageType.refresh:
                if (panel === undefined) {
                    console.error('创建 panel 失败');
                    return;
                }
                await sendFileTypes(panel.webview, p);
                break;
            default:
                console.error(`无法处理的消息类型：${msg.type}`);
        }
    });

    panel.onDidDispose(() => {
        panel = undefined;
        views.delete(folder.name);
    }, null, ctx.subscriptions);

    views.set(folder.name, panel);
}

async function sendFileTypes(v:vscode.Webview,p:project.Project) {
    const types = await p.types();
    v.postMessage({
        type: project.MessageType.file,
        data: types,
    });
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
    }).replace(/(<script.+?src=")(.+?)"/g, (m, $1, $2) => {
        const uri = buildResourceUri(ctx, 'resources', $2);
        return $1 + uri.toString() + '"';
    });
}

function buildResourceUri(ctx: vscode.ExtensionContext, ...paths: Array<string>): vscode.Uri {
    const p = path.join(ctx.extensionPath, ...paths);
    return vscode.Uri.file(p).with({ scheme: 'vscode-resource' });
}
