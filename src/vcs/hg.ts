// SPDX-License-Identifier: MIT

import * as fs from 'fs';
import * as path from 'path';
import { VCS } from './vcs';
import { readFiles } from './utils';

export class Hg implements VCS {
    public readonly name = 'Hg';

    public dir: string;

    constructor(dir: string) {
        this.dir = dir;
    }

    /**
     * 是否为 Hg 项目
     * @param dir 项目根目录
     */
    public static is(dir: string): boolean {
        return fs.existsSync(path.join(dir, '.hg'));
    }

    public files(): string[] {
        return readFiles(this.dir, ".hg", ".hgignore");
    }
}
