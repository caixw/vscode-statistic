// SPDX-License-Identifier: MIT

import ignore from 'ignore';
import * as filesystem from 'fs';
import * as path from 'path';
import { isIgnore } from './filter';

const fs = filesystem.promises;

/**
 * 读取指定目录下所有的文件列表
 *
 * @param dir 目录地址
 * @param meta 表示 VCS 中保存着无数据的文件夹名称
 * @param igFile 表示 VCS 中指定忽略内容的文件名
 * @returns Promise<string[]> 文件列表
 */
export async function readFiles(dir: string, meta: string, igFile: string): Promise<string[]> {
    let ret: string[] = [];

    const ig = ignore();

    const files = await fs.readdir(dir);
    for(const val of files){
        if (val === '' || val === meta || isIgnore(val)) {
            continue;
        }

        const p = path.join(dir, val);
        const stat = await fs.stat(p);
        if (stat.isDirectory()) {
            await readFiles(p, meta, igFile).then((val) => {
                ret.push(...val);
            });
        } else if (stat.isFile()) {
            if (val === igFile) {
                ig.add((await fs.readFile(p)).toString());
            } else {
                ret.push(p);
            }
        }
    }


    try {
        ret = ig.filter(ret.map((v) => {
            return path.relative(dir, v);
        }));
    } catch (e) {
        throw e;
    }

    return ret.map((v) => {
        return path.join(dir, v);
    });
}
