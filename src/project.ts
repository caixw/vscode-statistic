// Copyright 2019 by caixw, All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import * as files from './files';
import * as path from 'path';
import * as locale from './locale';

/**
 * 项目的统计信息
 */
export default class Project {
    Name: string;
    Path: string;
    Files: files.File[];
    Types: Type[];
    SumType: Type;

    /**
     * 构造函数
     * @param p 项目地址
     */
    constructor(p: string) {
        this.Path = p; 
        this.Name = path.basename(p);
        this.Files = files.loadFiles(p);
        this.Types = this.buildTypes();
        this.SumType = this.buildSumType();
    }

    /**
     * 计算 types
     */
    private buildTypes(): Type[] {
        const types: Types = {};
        this.Files.forEach((val, index) => {
            let name = path.extname(val.Path);
            if (name === '') {
                name = path.basename(val.Path)
            }

            let t = types[name];
            if (t === undefined) {
                t = new Type();
                t.Name = name;
                t.Min = Number.POSITIVE_INFINITY; // 先设置为无穷大
                types[name] = t;
            }

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
            const t = types[key];
            t.Avg = Math.floor(t.Lines / t.Files);
            ts.push(t);
        }

        return ts.sort((v1: Type, v2: Type) => {
            return v2.Lines-v1.Lines;
        });
    }

    private buildSumType(): Type {
        const sumType = new Type();
        sumType.Name = locale.l('sum');
        sumType.Min = Number.POSITIVE_INFINITY;
        for(const key in this.Types) {
            const t = this.Types[key];

            sumType.Files+=t.Files;
            sumType.Lines+=t.Lines;

            if (sumType.Max < t.Max) {
                sumType.Max = t.Max;
            }

            if (sumType.Min > t.Min) {
                sumType.Min = t.Min;
            }
        }
        sumType.Avg = Math.floor(sumType.Lines/sumType.Files);

        return sumType;
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
    Max: number = 0;
    Min: number = 0;
    Avg: number = 0;
}
