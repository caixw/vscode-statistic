// SPDX-License-Identifier: MIT

import * as vscode from 'vscode';
import * as path from 'path';
import * as locale from './locale';
import * as cheerio from 'cheerio';
import Project from './project';

// 保存已打开的视图面板实例，防止得复打开。
const views = new Map<string, vscode.WebviewPanel>();

/**
 * 创建 webview 页面
 */
export function create(ctx: vscode.ExtensionContext, folder: vscode.WorkspaceFolder) {
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
            retainContextWhenHidden: true,
        }
    );

    const lightIcon = path.join(ctx.extensionPath, "images", "icon.svg");
    const darkIcon = path.join(ctx.extensionPath, "images", "icon.svg");
    view.iconPath = {
        light: vscode.Uri.file(lightIcon),
        dark: vscode.Uri.file(darkIcon),
    };
    view.webview.html = build(ctx, folder);

    view.onDidDispose(() => {
        view = undefined;
        views.delete(folder.name);
    }, null, ctx.subscriptions);

    views.set(folder.name, view);
}

/**
 * 生成完整的 HTML 内容
 */
function build(ctx: vscode.ExtensionContext, folder: vscode.WorkspaceFolder): string {
    const project = new Project(folder.uri.path);

    const $ = cheerio.load(webviewHTML);
    $('html').attr('lang', locale.id());

    const body = $('body');
    let tpl = `<div class="meta">
    <h1>${project.name}</h1>
    <h2><label>${locale.l('vcs')}</label>${project.vcs.name}</h2>
    <h2><label>${locale.l('path')}</label>${project.path}</h2>
    </div>`;
    body.before(tpl);

    // 没有任何内容
    if (project.types.length === 0) {
        $('#none').append(locale.l('no-data'));
        return $.html();
    }

    // thead
    tpl = `<tr>
    <th>${locale.l('type')}</th>
    <th>${locale.l('files')}</th>
    <th>${locale.l('lines')}</th>
    <th>${locale.l('avg')}</th>
    <th>${locale.l('max')}</th>
    <th>${locale.l('min')}</th>
    </tr>`;
    $('table>thead').append(tpl);

    // tbody
    const tbody = $('table>tbody');
    project.types.forEach((v) => {
        const tpl = `<tr>
        <th>${v.name}</th>
        <td>${v.files}</td>
        <td>${v.lines}</td>
        <td>${v.avg}</td>
        <td>${v.max}</td>
        <td>${v.min}</td>
        </tr>`;
        tbody.append(tpl);
    });

    // tfoot
    tpl = `<tr>
    <th>${project.sumType.name}</th>
    <td>${project.sumType.files}</td>
    <td>${project.sumType.lines}</td>
    <td>${project.sumType.avg}</td>
    <td>${project.sumType.max}</td>
    <td>${project.sumType.min}</td>
    </tr>`;
    $('table>tfoot').append(tpl);

    return $.html();
}

const webviewHTML = `<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>statistic</title>
    <style>
        .meta label {
            display: inline-block;
            min-width: 4rem;
        }

        .meta label::after {
            content: ":";
        }

        table {
            width: 100%;
        }
        table tr th {
            text-align: left;
        }
        table tr {
            line-height: 2;
        }

        table td, table th {
            padding: 0 .5rem
        }

        table thead tr, table tfoot tr {
            background-color: rgba(0, 0, 0, 0.5);
        }

        table tbody tr:nth-child(even) {
            background-color: rgba(0, 0, 0, 0.2);
        }

        table tbody tr:hover {
            background-color: rgba(0, 0, 0, 0.5);
        }
    </style>
</head>
<body>
    <table>
        <thead></thead>
        <tbody></tbody>
        <tfoot></tfoot>
    </table>
</body>
<p id="none"></p>
</html>`;
