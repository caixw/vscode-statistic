// SPDX-License-Identifier: MIT

import * as fs from 'fs';
import * as path from 'path';
import { VCS } from './vcs';
import { isIgnore } from './filter';

/**
 * 表示不存在任何的 VCS
 */
export class None implements VCS {
    private readonly dir: string;

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
     * @param dir 目录地址
     * @returns 文件列表
     */
    private readFiles(dir: string): string[] {
        let ret: string[] = [];

        fs.readdirSync(dir)
            .forEach((val) => {
                if (isIgnore(val)) { return; }

                const p = path.join(dir, val);

                const stat = fs.statSync(p);
                if (stat.isDirectory()) {
                    this.readFiles(p).forEach((val) => {
                        ret.push(val);
                    });
                } else if (stat.isFile()) {
                    ret.push(p);
                }
            });

        return ret;
    }
}
