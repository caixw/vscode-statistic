// Copyright 2019 by caixw, All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import * as vscode from 'vscode';
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

	panel.webview.html = build(ctx, folder);
}

/**
 * 生成完整的 HTML 内容
 */
function build(ctx: vscode.ExtensionContext, folder: vscode.WorkspaceFolder): string {
	const project = new Project(folder.uri.path);

	const $ = cheerio.load(webviewHTML);
	$('html').attr('lang', locale.id());

	const body = $('body');
	body.before('<h1>'+project.Name+'</h1>');
	body.before('<h2>'+locale.l('path')+':'+project.Path+'</h2>');

	// thead
	let tpl = `<tr>
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
	project.Types.forEach((v, k) => {
		const tpl = `<tr>
		<th>${v.Name}</th>
		<td>${v.Files}</td>
		<td>${v.Lines}</td>
		<td>${v.Avg}</td>
		<td>${v.Max}</td>
		<td>${v.Min}</td>
		</tr>`;
		tbody.append(tpl);
	});

	// tfoot
	 tpl = `<tr>
	 <th>${project.SumType.Name}</th>
	 <td>${project.SumType.Files}</td>
	 <td>${project.SumType.Lines}</td>
	 <td>${project.SumType.Avg}</td>
	 <td>${project.SumType.Max}</td>
	 <td>${project.SumType.Min}</td>
	 </tr>`;
	$('table>tfoot').append(tpl);

	const html = $.html();

	console.log(html);
	return html;
}

const webviewHTML = `<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>
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
