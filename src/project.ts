// SPDX-License-Identifier: MIT

import * as path from 'path';
import * as filesystem from 'fs';
import * as locale from './locale/locale';
import * as vcs from './vcs/vcs';
import * as message from './message';
import * as line from './line/line';

const fs = filesystem.promises;

/**
 * 项目的统计信息
 */
export class Project {
    vcs: vcs.VCS;
    name: string;
    path: string;

    /**
     * 构造函数
     * @param p 项目地址
     */
    constructor(p: string) {
        this.vcs = vcs.New(p);
        this.path = p;
        this.name = path.basename(p);
    }

    /**
     * 加载项目下的每一个文件的统计信息
     */
    private async countLines(): Promise<line.Lines[]> {
        const files = await this.vcs.files();

        return (await Promise.all(files.map((path) => {
            return line.count(path);
        })));
    }

    /**
     * 获取各类文件的行数信息
     * 
     * @returns 返回为一个 Promise，附加一个 tuple，
     * 第一个参数为各个类型的行数信息列表，第二个参数合计的单行数据。
     */
    public async types(): Promise<message.FileTypes> {
        const types = this.buildTypes(await this.countLines());
        const total = this.buildTotalType(types);
        return {
            types,
            total,
        };
    }

    /**
     * 计算 types
     */
    private buildTypes(lines: line.Lines[]): message.FileType[] {
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
            t.avg = Math.floor(t.lines / t.files);
            ts.push(t);
        }

        return ts.sort((v1: message.FileType, v2: message.FileType) => {
            return v2.lines - v1.lines;
        });
    }

    private buildTotalType(types: message.FileType[]): message.FileType {
        const totalType = new message.FileType();
        totalType.name = locale.l('total');
        for (const t of types) {
            totalType.files += t.files;
            totalType.lines += t.lines;
            totalType.blanks += t.blanks;
            totalType.comments += t.comments;

            if (totalType.max < t.max) {
                totalType.max = t.max;
            }

            if (totalType.min > t.min) {
                totalType.min = t.min;
            }
        }
        totalType.avg = Math.floor(totalType.lines / totalType.files);

        return totalType;
    }
}
