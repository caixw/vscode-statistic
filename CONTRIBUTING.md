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

`locale` 的命名需要参照官方的格式：
https://code.visualstudio.com/docs/getstarted/locales#_available-locales

