// SPDX-License-Identifier: MIT

import { en } from './en';
import { zhCN } from './zh-cn';

// 以下为本地化的内容。
//
// 语种名称必须小写，格式遵守官方约定：
// https://code.visualstudio.com/docs/getstarted/locales#_available-locales
const locales = new Map<string, Locale>([
    ["en", en],
    ["zh-cn", zhCN],
]);

let localeID = 'en';
let locale: Locale;

/**
 * 显示指定标记的语言
 *
 * @param key 该条语言的标记，如果不存在，则原样返回
 */
export function l(key: string): string {
    return locale[key];
}

/**
 * 返回当前语言的 ID，比如 zh-cn 等
 */
export function id(): string {
    return localeID;
}

/**
 * 初始化，仅需要在入口入调用。
 */
export function init() {
    const cfg = process.env.VSCODE_NLS_CONFIG;
    if (cfg === undefined) {
        console.warn('无法获取 process.env.VSCODE_NLS_CONFIG，将区域信息设置为默认值！');
        return;
    }

    const config = JSON.parse(cfg);
    const id = (<string>config.locale).toLowerCase();

    const l = locales.get(id);
    if (l === undefined) {
        console.warn('无法获取 ' + id + ' 的本地化内容，采用默认值！');
        return;
    }

    locale = l;
    localeID = id;
}

interface Locale {
    [index: string]: string;
    name: string;
}