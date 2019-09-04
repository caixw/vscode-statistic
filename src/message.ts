// SPDX-License-Identifier: MIT

// 定义了扩展端和 webview 端传递消息的格式以及数据类型。

import * as vscode from 'vscode';

/**
 * 向 webview 发送消息内容
 *
 * @param view webview
 * @param msg 传递的消息内容
 */
export function send(view: vscode.Webview, msg: Message) {
    view.postMessage(msg);
}

export enum MessageType {
    // 由 webview 发起的消息
    refresh = 'refresh',

    // 由扩展端发起的请求
    file = 'file', // 发送 filetype 内容
    error = 'error',
    warn = 'warn',
    info = 'info',
    end = 'end',
}

export interface Message {
    type: MessageType;
    data?: FileType[] | string;
}

/**
 * 表示各个文件类型的统计信息
 */
export class FileType {
    name: string = ''; // 类型，一般为扩展名
    files: number = 0; // 文件数量
    lines: number = 0; // 总行数
    blanks: number = 0;
    comments: number = 0;
    max: number = 0;
    min: number = Number.POSITIVE_INFINITY;
}
