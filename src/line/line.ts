// SPDX-License-Identifier: MIT

import * as path from 'path';
import * as filesystem from 'fs';

const fs = filesystem.promises;

/**
 * 统计该文件中的行数信息
 *
 * @param p 文件地址
 */
export async function count(p: string): Promise<Lines> {
    let name = path.extname(p);
    if (name === '') {
        name = path.basename(p);
    }

    const content = (await fs.readFile(p, { encoding: 'utf8' }));
    return countContent(name, content);
}

function countContent(name: string, content: string): Lines {
    const lines = content.split('\n');

    const ret = {
        name,
        lines: lines.length,
        blanks: 0,
    };

    for (let line of lines) {
        line = line.trim();
        if (line.length === 0) {
            ret.blanks++;
        }

        // TODO
    }

    return ret;
}

export interface Lines {
    name: string; // 扩展名或是文件名
    lines: number; // 总行数
    blanks: number; // 空行的行数
}
