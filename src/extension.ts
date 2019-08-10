// Copyright 2019 by caixw, All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import * as vscode from 'vscode';
import * as locale from './locale';

// 初始化本地化信息
locale.init();

export function activate(context: vscode.ExtensionContext) {
	const cmdName = 'extension.statistic.show';
	const show = vscode.commands.registerCommand(cmdName, (uri: any) => {
		const folder = vscode.workspace.getWorkspaceFolder(<vscode.Uri>uri);
		if (folder === undefined) {
			vscode.window.showErrorMessage(locale.l('none-project'));
			return;
		}

		return createView(folder);
	});

	context.subscriptions.push(show);
}

export function deactivate() {}

function createView(folder: vscode.WorkspaceFolder) {
	const panel = vscode.window.createWebviewPanel(
		'statistic',
		locale.l('statistic'),
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			retainContextWhenHidden: true,
		}
	);

	panel.webview.html = '<html><h1>test</h1></html>';
}
