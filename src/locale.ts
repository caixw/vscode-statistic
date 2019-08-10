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
    return locale[key];
}

/**
 * 初始化，仅需要在入口入调用。
 */
export function init() {
    const cfg = process.env.VSCODE_NLS_CONFIG;
    if (cfg === undefined) {
        vscode.window.showErrorMessage('config error');
        return;
    }

    const config = JSON.parse(cfg);
    const l = locales[config.locale];
    if (locale !== undefined) {
        locale = l;
    }
}

const locales: Locales = {
    "zh-cn": {
        'name': '中文简体',
        'statistic': '项目统计',
        'none-project': '未选择任何项目',
    },

    "en": {
        'name': 'English',
        'statistic': 'statistic',
        'none-project': 'no project selected',
    }
};

let locale: Locale = locales['zh-cn'];

interface Locale {
    [index: string]: string;
    name: string;
}

interface Locales {
    [index: string]: Locale;
}