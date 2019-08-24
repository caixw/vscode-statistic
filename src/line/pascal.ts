// SPDX-License-Identifier: MIT

import * as block from './block';

/**
 * Pascal 中字符串的转义字符是引号本身。
 * 'this '' string'
 * 以上字符串中间的 '' 即为转议
 */
export class PascalString implements block.Block {
    readonly isComment = false;
    private readonly symbol: string;

    constructor(symbol: string) {
        if (symbol.length !== 1) {
            throw new Error(`参数 symbol 的长度必须为 1，当前为 ${symbol.length}`);
        }

        this.symbol = symbol;
    }

    public begin(line: string): number {
        const pos = line.indexOf(this.symbol);
        if (pos === -1) { return 0; }
        return pos + this.symbol.length;
    }

    public end(line: string): number {
        let pos = line.indexOf(this.symbol);
        const next = pos + this.symbol.length;

        switch (pos) {
            case -1:
                return 0;
            case 0:
                if (!this.isEscape(line, next)) {
                    return next;
                }

                // 因为转义字符本身也是引号，所以从 next 开始计算
                // 1 表示从转义字符之后的位置开始
                const pp = this.end(line.slice(next + 1));
                if (pp <= 0) { return pp; }
                pos = pos + 1 + pp;
                return (pos >= line.length) ? -1 : pos;
            default:
                if (!this.isEscape(line, next)) {
                    pos = next;
                } else { // 转义字符
                    // 因为转义字符本身也是引号，所以从 next 开始计算
                    // 1 表示从转义字符之后的位置开始
                    const pp = this.end(line.slice(next + 1));
                    if (pp <= 0) { return pp; }
                    pos = pos + 1 + pp;
                }

                return (pos >= line.length) ? -1 : pos;
        }
    }

    private isEscape(line: string, next: number): boolean {
        if (next > line.length) {
            return false;
        }

        return line.startsWith(this.symbol, next);
    }
}
