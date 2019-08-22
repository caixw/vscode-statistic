// SPDX-License-Identifier: MIT

import * as path from 'path';
import * as filesystem from 'fs';

const fs = filesystem.promises;

/**
 * 统计该文件中的行数信息
 *
 * @param path 文件地址
 */
export async function count(file: string): Promise<Lines> {
    let name = path.extname(file);
    if (name === '') {
        name = path.basename(file);
    }

    const content = (await fs.readFile(file, { encoding: 'utf8' }));
    return {
        name,
        lines: content.split('\n').length,
    };
}

export interface Lines {
    name: string; // 扩展名或是文件名
    lines: number; // 总行数
}
