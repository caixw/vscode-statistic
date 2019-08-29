// SPDX-License-Identifier: MIT

import * as path from 'path';
import * as filesystem from 'fs';
import * as block from './block';
import * as lang from './lang';

const fs = filesystem.promises;

// 当一行的长度超过此值，不会再分析该行的内容。
//
// 主要防止类似于压缩的 js 文件，几 K 的内容集于一行。
const lineMaxLength = 500;

/**
 * 统计该文件中的行数信息
 *
 * @param p 文件地址
 */
export async function count(p: string): Promise<Lines> {
    let name = path.extname(p);

    let blocks = lang.find(name);
    if (blocks === undefined) {
        blocks = [];
    }

    if (name === '') {
        name = path.basename(p);
    }

    const content = (await fs.readFile(p, { encoding: 'utf8' }));
    return countContent(name, content, blocks);
}

/**
 * 统计 content 中的的行数信息
 *
 * @param name 扩展名或是在扩展名不存在的情况下采用文件名代替
 * @param content 文件的内容
 * @param blocks 用于解析内容的 Block 实例列表
 */
export function countContent(name: string, content: string, blocks: Array<block.Block>): Lines {
    const lines = content.split('\n');

    const ret = {
        name,
        lines: lines.length,
        blanks: 0,
        comments: 0,
    };

    let b: null | block.Block = null;
    for (let line of lines) {
        line = line.trim();
        if (line.length === 0) {
            ret.blanks++;

            if ((b !== null) && (b.type !== block.BlockType.string)) {
                ret.comments++;
            }
            continue;
        }

        line = line.toLowerCase();

        if (b !== null) {
            if (b.type !== block.BlockType.string) { ret.comments++; }

            const end = b.end(line);
            if (end === 0) { // 当前不存在，需要找下一行
                continue;
            }

            b = null;

            if (end === -1) { // 正好结束，检测下一行的内容
                continue;
            }

            line = line.slice(end);
        }

        let [bb, matched] = matchLine(line, blocks);
        if (matched) { ret.comments++; }
        if (bb !== null) { b = bb; }
    }

    return ret;
}

/**
 * 在 line 中应用所有的 bs，看是否能找到一个匹配的 Block。
 * 如果找到，则返回该 Block。
 * 第二个返回参数表示匹配的 Block 是否为注释代码块。
 */
function matchLine(line: string, bs: Array<block.Block>): [null | block.Block, boolean] {
    if (line.length > lineMaxLength) { // 可能是压缩的 JS 文件
        return [null,false];
    }
    
    for (const bb of bs) {
        const start = bb.begin(line);
        if (start === 0) {
            continue;
        }

        if (start === -1) {
            if (bb.type === block.BlockType.signalComment) {
                return [null, true];
            }

            return [bb, (bb.type !== block.BlockType.string)];
        }

        let matched = bb.type !== block.BlockType.string;
        line = line.slice(start);

        const end = bb.end(line);
        switch (end) {
            case 0:// 当前不存在，需要找下一行
                return [bb, matched];
            case -1:// 正好结束，检测下一行的内容
                return [null, matched];
            default: // > 0
                let [b, m] = matchLine(line.slice(end), bs);
                return [b, matched || m];
        }
    }

    return [null, false];
}

export interface Lines {
    name: string; // 扩展名或是文件名
    lines: number; // 总行数
    blanks: number; // 空行的行数
    comments: number; // 带注释的行数
}
