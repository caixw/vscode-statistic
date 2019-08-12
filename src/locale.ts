// Copyright 2019 by caixw, All rights reserved.
// Use of this source code is governed by a MIT
// license that can be found in the LICENSE file.

import * as vscode from 'vscode';

/**
 * 显示指定标记的语言
 *
 * @param key 该条语言的标记，如果不存在，则原样返回
 */
export function l(key: string): string {
    return locales[localeID][key];
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
    localeID = 'zh-cn'; // 默认值

    const cfg = process.env.VSCODE_NLS_CONFIG;
    if (cfg === undefined) {
        const msg = '无法获取 process.env.VSCODE_NLS_CONFIG，将区域信息设置为默认值！';
        vscode.window.showErrorMessage(msg);
        return;
    }

    const config = JSON.parse(cfg);
    if (locales[config.locale] === undefined) {
        const msg = '无法获取 ' + config.locale + ' 的本地化内容，采用默认值！';
        vscode.window.showErrorMessage(msg);
        return;
    }

    localeID = config.locale;
}

const locales: Locales = {
    "zh-cn": {
        'name': '中文简体',
        'statistic': '项目统计',
        'none-project': '未选择任何项目',
        'path': '路径',
        'sum': '总计'
    },

    "en": {
        'name': 'English',
        'statistic': 'statistic',
        'none-project': 'no project selected',
        'path': 'path',
        'sum': 'sum'
    }
};

let localeID = 'zh-cn';

interface Locale {
    [index: string]: string;
    name: string;
}

interface Locales {
    [index: string]: Locale;
}