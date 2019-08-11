// Copyright 2019 by caixw, All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as locale from './locale';

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

		return createView(ctx);
	});

	ctx.subscriptions.push(show);
}

export function deactivate() { }

function createView(ctx: vscode.ExtensionContext) {
	const panel = vscode.window.createWebviewPanel(
		'statistic',
		locale.l('statistic'),
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			retainContextWhenHidden: true,
		}
	);

	panel.webview.html = loadWebview(ctx);
}

function loadWebview(ctx: vscode.ExtensionContext): string {
	const p = path.join(ctx.extensionPath, 'assets', 'webview.html');
	const dir = path.dirname(p);

	let html = fs.readFileSync(p, 'utf-8');
	html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
		return $1 + vscode.Uri.file(path.resolve(dir, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
	});
	return html;
}
