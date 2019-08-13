// SPDX-License-Identifier: MIT

import * as fs from 'fs';
import * as path from 'path';
import { VCS } from './vcs';

/**
 * 表示不存在任何的 VCS
 */
export class None implements VCS {
    private dir: string;

    public readonly name = 'None';

    constructor(dir: string) {
        this.dir = dir;
    }

    public files(): string[] {
        return this.readFiles(this.dir);
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

        const files = fs.readdirSync(dir);
        files.forEach((val, index) => {
            const p = path.join(dir, val);

            const stat = fs.statSync(p);
            if (stat.isDirectory()) {
                this.readFiles(p).forEach((val, index) => {
                    ret.push(val);
                });
            } else if (stat.isFile()) {
                ret.push(p);
            }
        });

        return ret;
    }
}
