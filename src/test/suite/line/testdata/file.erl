% SPDX-License-Identifier: MIT

 -module(hello).
 -export([hello_world/0]).

 %
 % 这是一段非 ascii 字符
 %
 hello_world() -> io:fwrite("\"Hello, World%\""). % hello world
