// SPDX-License-Identifier: MIT

import * as filesystem from 'fs';
import * as path from 'path';
import { VCS } from './vcs';
import { isIgnore } from './filter';

const fs = filesystem.promises;

/**
 * 表示不存在任何的 VCS
 */
export class None implements VCS {
    private readonly dir: string;

    public readonly name = 'None';

    constructor(dir: string) {
        this.dir = dir;
    }

    public files(): Promise<string[]> {
        return this.readFiles(this.dir);
    }

    /**
     * 读取指定目录下所有的文件列表
     *
     * @param dir 目录地址
     * @returns 文件列表
     */
    private async readFiles(dir: string): Promise<string[]> {
        let ret: string[] = [];

        const files = await fs.readdir(dir);
        for (const val of files) {
            if (isIgnore(val)) { continue; }

            const p = path.join(dir, val);

            const stat = await fs.stat(p);
            if (stat.isDirectory()) {
                (await this.readFiles(p)).forEach((val) => {
                    ret.push(val);
                });
            } else if (stat.isFile()) {
                ret.push(p);
            }
        }

        return ret;
    }
}
