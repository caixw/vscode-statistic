// SPDX-License-Identifier: MIT

import * as vscode from 'vscode';
import * as path from 'path';
import * as locale from './locale';
import * as cheerio from 'cheerio';
import Project from './project';

/**
 * 创建 webview 页面
 */
export function create(ctx: vscode.ExtensionContext, folder: vscode.WorkspaceFolder) {
    const panel = vscode.window.createWebviewPanel(
        'statistic',
        locale.l('statistic'),
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
        }
    );

    const lightIcon = path.join(ctx.extensionPath, "images", "icon.svg");
    const darkIcon = path.join(ctx.extensionPath, "images", "icon.svg");
    panel.iconPath = {
        light: vscode.Uri.file(lightIcon),
        dark: vscode.Uri.file(darkIcon),
    };
    panel.webview.html = build(ctx, folder);
}

/**
 * 生成完整的 HTML 内容
 */
function build(ctx: vscode.ExtensionContext, folder: vscode.WorkspaceFolder): string {
    // TODO 为文件类型加上图标？
    // https://github.com/Microsoft/vscode/issues/31466

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
    project.types.forEach((v, k) => {
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
            padding: 0rem .5rem
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
</html>`;
