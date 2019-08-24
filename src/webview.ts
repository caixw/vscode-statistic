// SPDX-License-Identifier: MIT

import * as vscode from 'vscode';
import * as path from 'path';
import * as locale from './locale/locale';
import * as filesystem from 'fs';
import * as project from './project';
import * as message from './message';

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

    const p = new project.Project(folder.uri.fsPath);
    panel.webview.html = await loadHTML(ctx, p);
    initWebviewMessage(panel, p);

    panel.onDidDispose(() => {
        panel = undefined;
        views.delete(folder.name);
    }, null, ctx.subscriptions);

    views.set(folder.name, panel);
}

// 初始化 webview 的消息通讯机制
function initWebviewMessage(panel: vscode.WebviewPanel, p: project.Project) {
    panel.webview.onDidReceiveMessage(async (e) => {
        const msg = e as message.Message;

        switch (msg.type) {
            case message.MessageType.refresh:
                message.send(panel.webview, {
                    type: message.MessageType.file,
                    data: await p.types(),
                });

                // 当前仅有一条消息可发送，发送完就结束内容。
                message.send(panel.webview, { type: message.MessageType.end });
                break;
            default:
                console.error(`无法处理的消息类型：${msg.type}`);
        }
    });
}

/**
 * 加载 HTML 内容
 *
 * 从 resource 加载 HTML 文件，并替换其中的脚本、CSS 等文件的链接为
 * vscode 允许的链接格式。
 * 同时会将 HTML 中的内容进行替换：
 * - v(key) 替换当前的变量；
 * - l(key) 替换当前的本地化语言内容；
 */
async function loadHTML(ctx: vscode.ExtensionContext, p: project.Project): Promise<string> {
    const htmlPath = buildResourceUri(ctx, 'resources', 'view.html').fsPath;
    const html = await fs.readFile(htmlPath, { encoding: 'utf8' });
    const linkRegexp = /(<img.+?src="|<link.+?href="|<script.+?src=")(.+?)"/g;

    return html.replace(/v\((.+?)\)/g, (m, $1) => {
        switch ($1) {
            case 'name':
                return p.name;
            case 'locale':
                return locale.id();
            case 'vcs':
                return p.vcs.name;
            case 'path':
                return p.path;
            default:
                return 'undefined';
        }
    }).replace(/l\((.+?)\)/g, (m, $1) => {
        return locale.l($1);
    }).replace(linkRegexp, (m, $1, $2) => {
        const uri = buildResourceUri(ctx, 'resources', $2);
        return $1 + uri.toString() + '"';
    });
}

function buildResourceUri(ctx: vscode.ExtensionContext, ...paths: Array<string>): vscode.Uri {
    const p = path.join(ctx.extensionPath, ...paths);
    return vscode.Uri.file(p).with({ scheme: 'vscode-resource' });
}
