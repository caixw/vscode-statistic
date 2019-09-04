// SPDX-License-Identifier: MIT

// 一些全局性的配置内容；
export default {
    /**
     * 限定最长的行长度
     *
     * 如果行的长度超过此值，将不再解析该行的注释等信息，直接当作普通行处理。
     * 主要防止类似于压缩的 js 文件，几 K 的内容集于一行。
     */
    maxLineLength: 300,

    /**
     * 每次解析的文件数量
     *
     * 项目是分批解析文件内容并发送数据至 webview，
     * 该值用于限定每批文件的数量。
     */
    filesPerParse: 1000,

    /**
     * webview 是否常驻后台
     *
     * 常驻会加大内存开销，但是不用每次切换 webview 都重新计算内容。
     */
    retainContextWhenHidden: true
};
