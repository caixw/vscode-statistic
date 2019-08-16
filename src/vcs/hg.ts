// SPDX-License-Identifier: MIT

import * as path from 'path';
import * as fs from 'fs';
import { VCS } from './vcs';
import { readFiles } from './utils';

export class Hg implements VCS {
    public readonly name = 'Hg';
    private readonly dir: string;

    /**
     * 是否为 Hg 项目
     * @param dir 项目根目录
     */
    public static is(dir: string): boolean {
        return fs.existsSync(path.join(dir, '.hg'));
    }

    constructor(dir: string) {
        this.dir = dir;
    }

    public files(): Promise<string[]> {
        return readFiles(this.dir, ".hg", ".hgignore");
    }
}
