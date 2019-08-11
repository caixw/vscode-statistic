// Copyright 2019 by caixw, All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import * as fs from 'fs';
import * as path from 'path';
import ignore from 'ignore';

/**
 * 加载项目下的每一个文件的统计信息
 *
 * @param p 项目的地址
 * @returns 返回内容按文件行数进行了排序
 */
export function loadFiles(p: string): File[] {
    let files = readFiles(p);

    const ret: File[] = [];
    files.forEach((val, index) => {
        const content = fs.readFileSync(val).toString();
        const lines = content.split('\n').length;
        const file = new (File);
        file.Path = val;
        file.Lines = lines;
        ret.push(file);
    });

    return ret.sort((v1: File, v2: File) => {
        return v1.Lines - v2.Lines;
    });
}

/**
 * 读取指定目录下所有的文件列表
 *
 * 会根据该目录下的 .gitignore 过滤相关的内容。
 *
 * @param dir 目录地址
 * @returns 文件列表
 */
function readFiles(dir: string): string[] {
    const ret: string[] = [];

    const ig = ignore();
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
            if (val === '.gitignore') {
                ig.add(fs.readFileSync(p).toString());
            } else {
                ret.push(p);
            }
        }
    });

    return ig.filter(ret);
}

/**
 * 每一种类型的文件统计信息
 */
export class File {
    Path: string = ''; // 文件名
    Lines: number = 0; // 总行数
}