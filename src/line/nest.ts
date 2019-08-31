// SPDX-License-Identifier: MIT

import * as block from './block';

/**
 * 可嵌套的多行注释
 */
export class MultipleComment implements block.Block {
    public readonly type = block.BlockType.multipleComment;
    private readonly beginString: string;
    private readonly endString: string;
    public depth = 0;

    constructor(begin: string, end: string) {
        if (begin === end) {
            throw new Error('相同的起始符号无法嵌套');
        }

        this.beginString = begin;
        this.endString = end;
    }

    public begin(line: string): number {
        let pos = line.indexOf(this.beginString);
        if (pos === -1) { return 0; }

        pos += this.beginString.length;
        return (pos >= line.length) ? -1 : pos;
    }

    public end(line: string): number {
        const [pos, type] = this.findFirst(line);
        if (pos === -1) { return 0; }

        switch (type) {
            case 'begin':
                this.depth++;
                const next = pos + this.beginString.length;
                let p = this.end(line.slice(next));
                if (p <= 0) { return p; }

                p += next;
                return p >= line.length ? -1 : p;
            case 'end':
                if (this.depth === 0) {
                    const pp = pos + this.endString.length;
                    return pp >= line.length ? -1 : pp;
                }

                this.depth--;
                const nxt = pos + this.endString.length;
                let pp = this.end(line.slice(nxt));
                if (pp <= 0) { return pp; }

                pp += nxt;
                return pp >= line.length ? -1 : pp;
            default:
                throw new Error(`findFirst 返回无效的 type 值:${type}`);
        }
    }

    /**
     * 查找第一个匹配的 begin 或是 end
     *
     * @param line 行内容
     * @returns 返回的两个参数，第一个表示匹配的位置，值同 string.indexOf 相同；
     * 第二个参数表示第一个参数的类型
     */
    private findFirst(line: string): [number, string] {
        const begin = line.indexOf(this.beginString);
        const end = line.indexOf(this.endString);

        if (begin === -1) {
            if (end === -1) { return [-1, '']; }
            return [end, 'end'];
        }

        if (end === -1) {
            if (begin === -1) { return [-1, '']; }
            return [begin, 'begin'];
        }

        if (begin < end) { // begin 在前
            return [begin, 'begin'];
        }

        if (end < begin) {
            return [end, 'end'];
        }

        throw new Error('不可能的错误：相同的起始符号');
    }
}
