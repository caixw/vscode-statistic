// SPDX-License-Identifier: MIT

import * as block from './block';

// php 的 herodoc 和 nowdoc 支持
//
// http://php.net/manual/zh/language.types.string.php#language.types.string.syntax.heredoc
export class PHPDoc implements block.Block {
    readonly type = block.BlockType.signalComment;
    private token1?: string;
    private token2?: string;

    public begin(line: string): number {
        const pos = line.indexOf('<<<');
        if (pos === -1) { return 0; }

        let token = line.slice(pos + 3);
        if (token.length === 0) {
            return 0;
        }

        const quote = (token.startsWith("'") && token.endsWith("'"))
            || (token.startsWith('"') && token.endsWith('"'));
        if (quote) {
            token = token.slice(1, token.length - 1);
        }

        this.token1 = token;
        this.token2 = token + ';';

        return -1;
    }

    public end(line: string): number {
        const matched = (line === this.token1) || (line === this.token2);

        return matched ? -1 : 0;
    }
}
