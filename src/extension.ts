// Copyright 2019 by caixw, All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('extension.statistic', (uri) => {
		// TODO
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
