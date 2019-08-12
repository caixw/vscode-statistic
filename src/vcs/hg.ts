// Copyright 2019 by caixw, All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import * as fs from 'fs';
import * as path from 'path';
import ignore from 'ignore';
import { VCS } from './vcs';

export class Hg implements VCS {
    public readonly name = 'Hg';

    public dir: string;

    constructor(dir: string) {
        this.dir = dir;
    }

    public files(): string[] {
        return this.readFiles(this.dir);
    }

    /**
     * 是否为 Hg 项目
     * @param dir 项目根目录
     */
    public static is(dir: string): boolean {
        return fs.existsSync(path.join(dir, '.hg'));
    }

    /**
     * 读取指定目录下所有的文件列表
     *
     * 会根据该目录下的 .gitignore 过滤相关的内容。
     *
     * @param dir 目录地址
     * @returns 文件列表
     */
    private readFiles(dir: string): string[] {
        let ret: string[] = [];

        const ig = ignore();
        const files = fs.readdirSync(dir);
        files.forEach((val, index) => {
            if (val === '' || val === '.hg') {
                return;
            }

            const p = path.join(dir, val);

            const stat = fs.statSync(p);
            if (stat.isDirectory()) {
                this.readFiles(p).forEach((val, index) => {
                    ret.push(val);
                });
            } else if (stat.isFile()) {
                if (val === '.hgignore') {
                    ig.add(fs.readFileSync(p).toString());
                } else {
                    ret.push(p);
                }
            }
        });


        try {
            ret = ig.filter(ret.map((v, k) => {
                const pp = path.relative(dir, v);
                return pp;
            }));
        } catch (e) {
            throw e;
        }

        return ret.map((v, k) => {
            return path.join(dir, v);
        });
    }
}