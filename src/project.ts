// Copyright 2019 by caixw, All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import * as path from 'path';
import * as fs from 'fs';
import * as locale from './locale';
import * as vcs from './vcs/vcs';

/**
 * 项目的统计信息
 */
export default class Project {
    VCS: vcs.VCS;
    Name: string;
    Path: string;
    Files: File[];
    Types: Type[];
    SumType: Type;

    /**
     * 构造函数
     * @param p 项目地址
     */
    constructor(p: string) {
        this.VCS = vcs.New(p);
        this.Path = p;
        this.Name = path.basename(p);
        this.Files = this.loadFiles();
        this.Types = this.buildTypes();
        this.SumType = this.buildSumType();
    }

    /**
     * 加载项目下的每一个文件的统计信息
     *
     * @returns 返回内容按文件行数进行了排序
     */
    private loadFiles(): File[] {
        let files = this.VCS.files();

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
            return v2.Lines - v1.Lines;
        });
    }

    /**
     * 计算 types
     */
    private buildTypes(): Type[] {
        const types: Types = {};
        this.Files.forEach((val, index) => {
            let name = path.extname(val.Path);
            if (name === '') {
                name = path.basename(val.Path);
            }

            let t = types[name];
            if (t === undefined) {
                t = new Type();
                t.Name = name;
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
        for (const key in types) {
            const t = types[key];
            t.Avg = Math.floor(t.Lines / t.Files);
            ts.push(t);
        }

        return ts.sort((v1: Type, v2: Type) => {
            return v2.Lines - v1.Lines;
        });
    }

    private buildSumType(): Type {
        const sumType = new Type();
        sumType.Name = locale.l('sum');
        for (const key in this.Types) {
            const t = this.Types[key];

            sumType.Files += t.Files;
            sumType.Lines += t.Lines;

            if (sumType.Max < t.Max) {
                sumType.Max = t.Max;
            }

            if (sumType.Min > t.Min) {
                sumType.Min = t.Min;
            }
        }
        sumType.Avg = Math.floor(sumType.Lines / sumType.Files);

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
    Min: number = Number.POSITIVE_INFINITY;
    Avg: number = 0;
}

/**
 * 每一种类型的文件统计信息
 */
export class File {
    Path: string = ''; // 文件名
    Lines: number = 0; // 总行数
}
