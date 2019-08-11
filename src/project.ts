// Copyright 2019 by caixw, All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import * as vscode from 'vscode';
import * as files from './files';
import * as path from 'path';

/**
 * 加载项目的编译信息
 * @param uri 项目的地址
 */
export default function load(folder: vscode.WorkspaceFolder): Project {
    const project = new(Project);

    project.Files = files.loadFiles(folder);

    // 计算 types
    project.Files.forEach((val, index) => {
        const ext = path.extname(val.Path);
        let t = project.Types[ext];
        t.Files++;
        t.Lines+=val.Lines;
        if (t.Max < val.Lines) {
            t.Max = val.Lines;
        }
        if (t.Min > val.Lines) {
            t.Min = val.Lines;
        }
    });


    return project;
}

/**
 * 项目的统计信息
 */
export class Project {
    Files: files.File[] = [];
    Types: Types = {};
}

interface Types {
    [index: string]: Type;
}

export class Type {
    Name:     string = ''; // 类型，一般为扩展名
    Files:    number = 0;  // 文件数量
    Lines:    number = 0;  // 总行数
    Max:      number = 0;  // 最大的行数
    Min:      number = 0;  // 最小行数
}
