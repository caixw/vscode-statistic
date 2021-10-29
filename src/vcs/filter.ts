// SPDX-License-Identifier: MIT

import * as mt from 'mime-types';
import * as path from 'path';

// 需要被忽略的文件或是扩展名
const ignoreFiles: string[] = [
    // 图片
    '.jpg', '.jpeg',
    '.png',
    '.bmp',
    '.gif',
    '.ico', '.icon',

    // 文档
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.wps',
    '.odf',

    // 压缩
    '.zip',
    '.rar',
    '.gzip',
    '.7z',

    // 可执行文件
    '.exe',
    '.so',
    '.a',
    '.lib',
    '.dll',

    // 特定的平台或软件相关
    '.DS_Store',
    '.swp',
    '.lock',
    '.vsix',

    // 特定语言下需要过滤的文件
    'package-lock.json',
    'go.sum',
    '.vscodeignore',
];

// 不能忽略的文件或是扩展名，权限低于 ignoreFiles
const files: string[] = [
    // 编程语言
    '.applescript',
    '.asp',
    '.coffee',
    '.cpp', '.cc', '.c', '.h', '.hpp', '.cxx', '.hxx',
    '.cs',
    '.cmd',
    '.d',
    '.erl', '.hrl',
    '.go',
    '.java', '.scala', '.kt', '.groovy',
    '.jsp',
    '.jl',
    '.js', '.jsx', '.mjs', '.ts', '.tsx', '.dart',
    '.lua',
    '.pas', '.pp',
    '.perl', '.prl', '.pl',
    '.php', '.php3', '.php4',
    '.py',
    '.ps1',
    '.rb',
    '.rs',
    '.swift',
    '.sql',
    '.sh',
    '.vue',

    // mark language
    '.xml', '.xsl', '.xslt', '.xsd', '.dtd', '.rss', '.rdf', '.wsdl',
    '.svg',
    '.html', '.htm', '.shtml', '.xhtml',

    // 样式表
    '.css', '.less', '.sass', '.scss',

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
    // - 由 ignoreFiles 指定的需要忽略的文件后缀名；
    // - 由 files 指定的不需要忽略的文件后缀名；
    // - 通过 mimetype 根据其后缀名获取相应的 mimetype 类型，
    // 非 text/ 下的全都当二进制处理。
    // application/json 之类的可以直接写在 textExt 中。

    // path.extname 在处理诸如 .DS_Store 等文件时，会返回空值，
    // 此处需要将其它当作扩展名来处理。

    const basename = path.basename(v);
    if (fileInArray(ignoreFiles, basename)) { // 指定忽略
        return true;
    }

    if (fileInArray(files, basename)) { // 指定不忽略
        return false;
    }

    if ('' === path.extname(v)) {
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

// 判断文件是否在 arr 中，会同时对整个文件和其扩展名进行匹配。
function fileInArray(arr: string[], file: string): boolean {
    const ext = path.extname(file);

    for (const elem of arr) {
        if (elem === file || elem === ext) {
            return true;
        }
    }
    return false;
}
