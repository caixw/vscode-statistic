// SPDX-License-Identifier: MIT

import * as path from 'path';
import * as fs from 'fs';
import * as locale from './locale';
import * as vcs from './vcs/vcs';
import { filter } from './filter';
import { timingSafeEqual } from 'crypto';

/**
 * 项目的统计信息
 */
export default class Project {
    vcs: vcs.VCS;
    name: string;
    path: string;
    files: File[];
    types: Type[];
    sumType: Type;

    /**
     * 构造函数
     * @param p 项目地址
     */
    constructor(p: string) {
        this.vcs = vcs.New(p);
        this.path = p;
        this.name = path.basename(p);
        this.files = this.loadFiles();
        this.types = this.buildTypes();
        this.sumType = this.buildSumType();
    }

    /**
     * 加载项目下的每一个文件的统计信息
     *
     * @returns 返回内容按文件行数进行了排序
     */
    private loadFiles(): File[] {
        const ret: File[] = [];

        filter(this.vcs.files())
            .forEach((val, index) => {
                const content = fs.readFileSync(val).toString();
                const lines = content.split('\n').length;
                const file = new (File);
                file.path = val;
                file.lines = lines;
                ret.push(file);
            });

        return ret.sort((v1: File, v2: File) => {
            return v2.lines - v1.lines;
        });
    }

    /**
     * 计算 types
     */
    private buildTypes(): Type[] {
        const types: Types = {};
        this.files.map((val, index) => {
            let name = path.extname(val.path);
            if (name === '') {
                name = path.basename(val.path);
            }

            let t = types[name];
            if (t === undefined) {
                t = new Type();
                t.name = name;
                types[name] = t;
            }

            t.files++;
            t.lines += val.lines;
            if (t.max < val.lines) {
                t.max = val.lines;
            }
            if (t.min > val.lines) {
                t.min = val.lines;
            }
        });

        const ts: Type[] = [];
        for (const key in types) {
            const t = types[key];
            t.avg = Math.floor(t.lines / t.files);
            ts.push(t);
        }

        return ts.sort((v1: Type, v2: Type) => {
            return v2.lines - v1.lines;
        });
    }

    private buildSumType(): Type {
        const sumType = new Type();
        sumType.name = locale.l('sum');
        for (const key in this.types) {
            const t = this.types[key];

            sumType.files += t.files;
            sumType.lines += t.lines;

            if (sumType.max < t.max) {
                sumType.max = t.max;
            }

            if (sumType.min > t.min) {
                sumType.min = t.min;
            }
        }
        sumType.avg = Math.floor(sumType.lines / sumType.files);

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
    name: string = ''; // 类型，一般为扩展名
    files: number = 0; // 文件数量
    lines: number = 0; // 总行数
    max: number = 0;
    min: number = Number.POSITIVE_INFINITY;
    avg: number = 0;
}

/**
 * 每一种类型的文件统计信息
 */
export class File {
    path: string = ''; // 文件名
    lines: number = 0; // 总行数
}
