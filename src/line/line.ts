// SPDX-License-Identifier: MIT

import * as filesystem from 'fs';

const fs = filesystem.promises;

/**
 * 统计该文件中的行数信息
 *
 * @param path 文件地址
 */
export async function count(path: string): Promise<Lines> {
    const content = (await fs.readFile(path, { encoding: 'utf8' }));
    return {
        path,
        lines: content.split('\n').length,
    };
}

export interface Lines {
    path: string; // 文件名
    lines: number; // 总行数
}
