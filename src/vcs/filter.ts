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
    '.lock',
];

const textExt: string[] = [
    // 编程语言
    '.coffee',
    '.cpp', '.cc', '.c', '.h', '.hpp',
    '.cs',
    '.cmd',
    '.d',
    '.go',
    '.java', '.scala', '.kt', '.groovy',
    '.js', '.ts', '.dart',
    '.lua',
    '.pas',
    '.perl',
    '.php', '.php3', '.php4',
    '.py',
    '.ps1',
    '.rb',
    '.rust',
    '.swift',
    '.sql',
    '.sh',

    // mark language
    '.xml',
    '.svg',
    '.html', '.htm', '.shtml', '.xhtml',

    // 样式表
    '.css', '.less', '.sass', 'scss',

    // 文本
    '.md',
    '.txt',
    'LICENSE', // 文件名
    'Makefile',
    'README',

    // 配置
    '.yaml', '.yml',
    '.toml',
    '.json',
    '.conf',
    '.ini',
];

/**
 * 判断当前文件是否需要被过滤，该功能的调用应该要在 VCS 的 ignore 文件判断之前。
 *
 * @param v 文件名，仅用到文件名和扩展名部分，是否包含路径信息，都不影响判断。
 */
export function isIgnore(v: string): boolean {
    // 过滤分成三部分
    // - 由 ignoreExt 指定的需要忽略的文件后缀名；
    // - 由 textExt 指定的不需要忽略的文件后缀名；
    // - 通过 mimetype 根据其后缀名获取相应的 mimetype 类型，
    // 非 text/ 下的全都当二进制处理。
    // application/json 之类的可以直接写在 textExt 中。

    // path.extname 在处理诸如 .DS_Store 等文件时，会返回空值，
    // 此处需要将其它当作扩展名来处理。
    let ext = path.extname(v);
    const noExt = (ext === '');
    if (noExt) {
        ext = path.basename(v);
    }

    if (inArray(ignoreExt, ext)) { // 指定忽略
        return true;
    }

    if (inArray(textExt, ext)) { // 指定不忽略
        return false;
    }

    if (noExt) {
        return false;
    }
    
    return !isMimetypeText(v);
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
