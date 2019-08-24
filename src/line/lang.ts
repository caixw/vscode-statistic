// SPDX-License-Identifier: MIT

import * as block from './block';
import * as pascal from './pascal';
import * as php from './php';

/**
 * 查找指定扩展名对应的 block.Block 实例。
 *
 * @param ext 扩展名，必须带 . 符号
 */
export function find(ext: string): undefined | block.Block[] {
    return langs.get(ext);
}

const langs = new Map<string, block.Block[]>();

function register(blocks: block.Block[], ...exts: string[]) {
    for (const ext of exts) {
        if (langs.has(ext)) {
            throw new Error(`已经存在相同扩展名 ${ext} 的 Block 实现`);
        }

        langs.set(ext, blocks);
    }
}

const cStyle: Array<block.Block> = [
    new block.String('"', '"', '\\'),
    new block.String("'", "'", '\\'),
    new block.SignalComment("//"),
    new block.MultipleComment("/*", "*/"),
];

/*####################### 以下为注册各类语言的注释解析模块的注册############# */
// 按名称的字符顺序排列

// bash
register([
    new block.String('"', '"', '\\'),
    new block.String("`", "`", '\\'),
    new block.SignalComment('#'),
], '.sh', '.bash');

// c#
register(cStyle, '.cs');

// c/c++
register(cStyle, '.c', '.cpp', '.cxx', '.h', '.hpp');

// cmd/powerShell
register([
    new block.SignalComment('rem'),
], '.cmd', '.ps1');

// d
register(cStyle, '.d');

// erlang
register([
    new block.String('"', '"', '\\'),
    new block.SignalComment('%'),
], '.erl', '.hrl');

// go
register([
    new block.String('"', '"', '\\'),
    new block.String('`', '`'),
    new block.String("'", "'"),
    new block.SignalComment('//'),
    new block.MultipleComment('/*', '*/'),
], '.go');

// groovy
register([
    new block.String('"', '"', '\\'),
    new block.String("'", "'", '\\'),
    new block.String("'''", "'''", '\\'),
    new block.SignalComment('//'),
    new block.MultipleComment('/*', '*/'),
], '.groovy');

// java
register(cStyle, '.java');

// javascript
register([
    new block.String('"', '"', '\\'),
    new block.String("'", "'", '\\'),
    new block.String("`", "`"),
    new block.SignalComment('//'),
    new block.MultipleComment('/*', '*/'),
    // 需要放在 // 之后
    new block.String("/", "/"),
], '.js');

// json
// 现在大部分 json 配置中都带了注释
register([
    new block.String('"', '"', '\\'),
    new block.String("'", "'", '\\'),
    new block.SignalComment('//'),
    new block.MultipleComment('/*', '*/'),
], '.json');

// kotlin
register(cStyle, '.kt');

// pascal/delphi
register([
    new pascal.PascalString("'"),
    new block.MultipleComment('{*', '*}'),
    new block.MultipleComment('{', '}'),
], '.pas', '.pp');

// perl
register([
    new block.String('"', '"', '\\'),
    new block.String("'", "'", '\\'),
    new block.SignalComment('#'),
    new block.MultipleComment('\n=pod\n', '\n=cut\n'),
], '.perl', '.prl', '.pl');

// php
register([
    new php.PHPDoc(), // 保证 <<< 第一个被匹配
    new block.String('"', '"', '\\'),
    new block.String("'", "'", '\\'),
    new block.SignalComment('#'),
    new block.SignalComment('//'),
    new block.MultipleComment('/*', '*/'),
], '.php', '.php4');

// python
register([
    new block.String('"', '"', '\\'),
    new block.SignalComment('#'),
    new block.MultipleComment('"""', '"""'),
    new block.MultipleComment("'''", "'''"),
], '.py');

// ruby
register([
    new block.String('"', '"', '\\'),
    new block.String("'", "'", '\\'),
    new block.SignalComment('#'),
    new block.MultipleComment('\n=begin\n', '\n=end\n'),
], '.rb');

// rust
register([
    new block.String('"', '"', '\\'),
    new block.String("`", "`", '\\'),
    new block.SignalComment('//'),
    new block.MultipleComment('/*', '*/'),
], '.rs');

// scala
register(cStyle, '.scala');

// swift
register([
    new block.String('"', '"', '\\'),
    new block.String("`", "`", '\\'),
    new block.SignalComment('//'),
], '.swift');

// typescript
register([
    new block.String('"', '"', '\\'),
    new block.String("'", "'", '\\'),
    new block.String("`", "`"),
    new block.SignalComment('//'),
    new block.MultipleComment('/*', '*/'),
    // 需要放在 // 之后
    new block.String("/", "/"),
], '.ts');

// yaml
register([
    new block.String('"', '"', '\\'),
    new block.String("'", "'", '\\'),
    new block.SignalComment('#'),
], '.yaml', '.yml');
