# 如何贡献代码

小项目，请随意，大家觉得有好的点子或是可以改进的地方，
可以直接发起 PR，也可以发到 [issues](https://github.com/caixw/vscode-statistic/issues)


## 本地化

本地化涉及到两处：
- package.nls.<`locale`>.json 为每一个语种单独一个文件；
- src/locale/<`locale`>.ts 也是一个语种的为一个单独文件。


## 新语言

系统根据 line/lang.ts 中的相关定义统计相关编程语言的注释行数信息，
如果有需要添加新的语言类型，也可以在此文件下添加，要求按名称顺序进行注册。


## 测试

测试用到的文件统一放在 testdata 目录下，该目录下的内容会在编译时被复制到 out 之下，
同时该目录下的 ts 文件不会被编译。
测试时，可以指定一个测试用的 vscode 版本：`npm test version`，目前支持以下三种版本形式：
- insiders insiders 版本；
- minimum 支持的最小版本，该版本号由 package.json/engines.vscode 指定；
- stable 最新的稳定版；

如果你使用稳定版编写代码，那么你可使用 `npm test insiders` 指这运行 insiders 用于测试，
这样可以避免测试时不能同时打开 vscode 的问题。

`locale` 的命名需要参照官方的格式：
https://code.visualstudio.com/docs/getstarted/locales#_available-locales

