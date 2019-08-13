// SPDX-License-Identifier: MIT

import * as mt from 'mime-types';
import * as path from 'path';

const ignoreExt: string[] = [
    '.jpg', '.jpeg',
    '.png',
    '.bmp',
    '.gif',
    '.ico', '.icon',

    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.wps',
    '.odf',

    '.zip',
    '.rar',
    '.gzip',

    '.exe',
    '.so',
    '.a',
    '.lib',

    '.DS_Store',
    '.swp',
];

const textExt: string[] = [
    // 编程语言
    '.cpp', '.cc', '.c', '.h', '.hpp',
    '.go',
    '.java', '.scala', '.kt',
    '.js', '.ts', '.dart',
    '.perl',
    '.swift',
    '.rb',
    '.php', '.php3', '.php4',

    // mark language
    '.xml',
    '.svg',
    '.html', '.htm', '.shtml', '.xhtml',

    // 样式表
    '.css', '.less', '.sass',

    // 文本
    '.md',
    '.txt',

    // 配置
    '.yaml', '.yml',
    '.toml',
    '.json',
    '.conf',
];

/**
 * 过滤文件列表中的二进制内容
 *
 * @param files 需要过滤的文件列表
 * @returns 过滤后的文件列表
 */
export function filter(files: string[]): string[] {
    // 过滤分成三部分
    // - 由 ignoreExt 指定的需要忽略的文件后缀名；
    // - 由 textExt 指定的不需要忽略的文件后缀名；
    // - 通过 mimetype 根据其后缀名获取相应的 mimetype 类型，
    // 非 text/ 下的全都当二进制处理。
    // application/json 之类的可以直接写在 textExt 中。

    const ret: string[] = [];
    files.forEach((v, k) => {
        const ext = path.extname(v);

        if (ext === '') {
            ret.push(v);
            return;
        }

        if (inArray(ignoreExt, ext)) { // 指定忽略
            return;
        }

        if (inArray(textExt, ext)) { // 指定不忽略
            ret.push(v);
            return;
        }

        if (isMimetypeText(ext)) {
            ret.push(v);
            return;
        }
    });

    return ret;
}

function isMimetypeText(path: string): boolean {
    // mt.lookup 也是根据后缀名作的判断，如果不带后缀名，会直接返回 false
    const mime = mt.lookup(path);
    if (mime === false) {
        return false;
    }

    return mime.startsWith('text/');
}

function inArray(arr: string[], key: string): boolean {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === key) {
            return true;
        }
    }
    return false;
}
