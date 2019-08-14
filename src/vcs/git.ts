// SPDX-License-Identifier: MIT

import * as path from 'path';
import * as fs from 'fs';
import { VCS } from './vcs';
import { readFiles } from './utils';

export class Git implements VCS {
    public readonly name = 'Git';
    private readonly dir: string;

    /**
     * 是否为 Git 项目
     * @param dir 项目根目录
     */
    public static is(dir: string): boolean {
        return fs.existsSync(path.join(dir, '.git'));
    }

    constructor(dir: string) {
        this.dir = dir;
    }

    public files(): string[] {
        return readFiles(this.dir, ".git", ".gitignore");
    }
}
