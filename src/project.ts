// Copyright 2019 by caixw, All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import * as vscode from 'vscode';

/**
 * 加载项目的编译信息
 * @param uri 项目的地址
 */
export default function load(uri: vscode.Uri): Project {
    // TODO
    return new(Project)
}

/**
 * 项目的统计信息
 */
export class Project {
    Files:File[] = [];
}

/**
 * 每一种类型的文件统计信息
 */
export class File {
    Name:     string = ''; // 文件名，一般为扩展名
    Lines:    number = 0; // 总行数
    Comments: number = 0; // 注释的行数
}