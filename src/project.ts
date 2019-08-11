// Copyright 2019 by caixw, All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import * as files from './files';
import * as path from 'path';

/**
 * 项目的统计信息
 */
export default class Project {
    Name: string;
    Path: string;
    Files: files.File[];
    Types: Type[];

    /**
     * 构造函数
     * @param p 项目地址
     */
    constructor(p: string) {
        this.Path = p; 
        this.Name = path.basename(p);
        this.Files = files.loadFiles(p);
        this.Types = this.buildTypes();
    }

    /**
     * 计算 types
     */
    private buildTypes(): Type[] {
        const types: Types = {};
        this.Files.forEach((val, index) => {
            const ext = path.extname(val.Path);
            let t = types[ext];
            t.Files++;
            t.Lines += val.Lines;
            if (t.Max < val.Lines) {
                t.Max = val.Lines;
            }
            if (t.Min > val.Lines) {
                t.Min = val.Lines;
            }
        });

        const ts: Type[] = [];
        for(const key in types) {
            ts.push(types[key]);
        }

        return ts.sort((v1: Type, v2: Type) => {
            return v1.Lines-v2.Lines;
        });
    }
}

interface Types {
    [index: string]: Type;
}

/**
 * 表示各个语言类型的统计信息
 */
export class Type {
    Name: string = ''; // 类型，一般为扩展名
    Files: number = 0; // 文件数量
    Lines: number = 0; // 总行数
    Max: number = 0;   // 最大的行数
    Min: number = 0;   // 最小行数
}
