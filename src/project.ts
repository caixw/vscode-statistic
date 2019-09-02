// SPDX-License-Identifier: MIT

import * as path from 'path';
import * as vcs from './vcs/vcs';
import * as message from './message';
import * as line from './line/line';
import * as vscode from 'vscode';

const size = 1000;

/**
 * 项目的统计信息
 */
export class Project {
    vcs: vcs.VCS;
    name: string;
    path: string;
    panel: vscode.WebviewPanel;

    /**
     * 构造函数
     * @param p 项目地址
     */
    constructor(p: string, panel: vscode.WebviewPanel) {
        this.vcs = vcs.New(p);
        this.path = p;
        this.name = path.basename(p);
        this.panel = panel;

        panel.webview.onDidReceiveMessage(async (e) => {
            const msg = e as message.Message;
            switch (msg.type) {
                case message.MessageType.refresh:
                    await this.post();
                    break;
                default:
                    throw new Error(`无法处理的消息类型：${msg.type}`);
            }
        });
    }

    /**
     * 发送内容到 webview
     */
    public async post() {
        const files = await this.vcs.files();

        for (let i = 0; i < files.length; i += size) {
            let end = i + size;
            if (end > files.length) { end = files.length; }

            const list = files.slice(i, end);
            const lines = (await Promise.all(list.map((path) => {
                return line.count(path);
            })));

            const types = buildTypes(lines);

            message.send(this.panel.webview, {
                type: message.MessageType.file,
                data: types,
            });
        } // end for

        message.send(this.panel.webview, {
            type: message.MessageType.end,
        });
    }
}

function buildTypes(lines: line.Lines[]): message.FileType[] {
    const types = new Map<string, message.FileType>();
    for (const l of lines) {
        let t = types.get(l.name);
        if (t === undefined) {
            t = new message.FileType();
            t.name = l.name;
            types.set(l.name, t);
        }

        t.files++;
        t.lines += l.lines;
        t.blanks += l.blanks;
        t.comments += l.comments;
        if (t.max < l.lines) {
            t.max = l.lines;
        }
        if (t.min > l.lines) {
            t.min = l.lines;
        }
    }

    const ts: message.FileType[] = [];
    for (const t of types.values()) {
        ts.push(t);
    }
    return ts;
}
