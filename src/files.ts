// Copyright 2019 by caixw, All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import ignore from 'ignore';

/**
 * 加载项目的统计信息
 * @param uri 项目的地址
 */
export function loadFiles(folder: vscode.WorkspaceFolder): File[] {
    let files = readFiles(folder.uri.path);

    const igFile = path.join(folder.uri.path, '.gitignore');
    files = ignore()
    .add(fs.readFileSync(igFile).toString())
    .filter(files);

    const ret: File[] = [];
    files.forEach((val, index) => {
        const content = fs.readFileSync(val).toString();
        const lines = content.split('\n').length;
        const file = new(File);
        file.Path = val;
        file.Lines = lines;
        ret.push(file);
    });

    return ret;
}

function readFiles(dir: string): string[] {
    const ret: string[] = [];

    const files = fs.readdirSync(dir);
    files.forEach((val, index) => {
        const p = path.join(dir, val);
        const stat = fs.statSync(p);

        if (stat.isDirectory()) {
            const items = readFiles(p);
            items.forEach((val, index) => {
                ret.push(val);
            });
        } else if (stat.isFile()) {
            ret.push(p);
        }
    });

    return ret;
}

/**
 * 每一种类型的文件统计信息
 */
export class File {
    Path:     string = ''; // 文件名
    Lines:    number = 0;  // 总行数
}