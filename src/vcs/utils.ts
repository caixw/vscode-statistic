// SPDX-License-Identifier: MIT

import ignore from 'ignore';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 读取指定目录下所有的文件列表
 *
 * 会根据该目录下的 .hgignore/ 过滤相关的内容。
 *
 * @param dir 目录地址
 * @returns 文件列表
 */
export function readFiles(dir: string, meta: string, igFile: string): string[] {
    let ret: string[] = [];

    const ig = ignore();
    const files = fs.readdirSync(dir);
    files.forEach((val, index) => {
        if (val === '' || val === meta) {
            return;
        }

        const p = path.join(dir, val);

        const stat = fs.statSync(p);
        if (stat.isDirectory()) {
            readFiles(p, meta, igFile).forEach((val, index) => {
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
        ret = ig.filter(ret.map((v, k) => {
            const pp = path.relative(dir, v);
            return pp;
        }));
    } catch (e) {
        throw e;
    }

    return ret.map((v, k) => {
        return path.join(dir, v);
    });
}
