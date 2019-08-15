// SPDX-License-Identifier: MIT

import ignore from 'ignore';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 读取指定目录下所有的文件列表
 *
 * @param dir 目录地址
 * @param meta 表示 VCS 中保存着无数据的文件夹名称
 * @param igFile 表示 VCS 中指定忽略内容的文件名
 * @returns 文件列表
 */
export function readFiles(dir: string, meta: string, igFile: string): string[] {
    let ret: string[] = [];

    const ig = ignore();
    const files = fs.readdirSync(dir);
    files.forEach((val) => {
        if (val === '' || val === meta) {
            return;
        }

        const p = path.join(dir, val);

        const stat = fs.statSync(p);
        if (stat.isDirectory()) {
            readFiles(p, meta, igFile).forEach((val) => {
                ret.push(val);
            });
        } else if (stat.isFile()) {
            if (val === igFile) {
                ig.add(fs.readFileSync(p).toString());
            } else {
                ret.push(p);
            }
        }
    });


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
