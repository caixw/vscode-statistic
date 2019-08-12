// Copyright 2019 by caixw, All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import * as vscode from 'vscode';
import * as locale from './locale';
import * as path from 'path';
import * as fs from 'fs';
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
	const dir = path.join(ctx.extensionPath, "assets");
	const filename = 'webview.' + locale.id() + '.html';

	// 尝试获取模板内容，如果不存在当前语言版的，会调用默认默板，
	// 如果默认的也不存在，则由库自行处理，一般为抛出异常？
	let p = path.join(dir, filename);
	if (!fs.existsSync(p)) {
		p = path.join(dir, 'webview.html');
	}
	let html = fs.readFileSync(p, 'utf-8');

	// 替换连接
	html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
		return $1 + vscode.Uri.file(path.resolve(dir, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
	});

	// project
	const project = new Project(folder.uri.path);
	html = html.replace('{}', JSON.stringify(project));

	return html;
}
