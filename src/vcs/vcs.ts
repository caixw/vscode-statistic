// SPDX-License-Identifier: MIT

import { Git } from './git';
import { Hg } from './hg';
import { None } from './none';

/**
 * 根据项目文件夹的内容，声明一个合适的 VCS 实例。
 *
 * @param dir 项目文件夹根目录
 */
export function New(dir: string): VCS {
    if (Git.is(dir)) {
        return new Git(dir);
    } else if (Hg.is(dir)) {
        return new Hg(dir);
    } else {
        return new None(dir);
    }
}

/**
 * 所有 VCS 需要实现的接口
 */
export interface VCS {
    /**
     * VCS 的名称
     */
    readonly name: string;

    /**
     * 获取项目目录下的文件列表，会过滤掉被 VCS 忽略的文件。
     */
    files(): string[];
}
