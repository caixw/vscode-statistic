<?php
// SPDX-License-Identifier: MIT

/**
 * 这是一段非 ascii 字符
 */

const hello = <<<HELLO
"Hello,
HELLO;

echo hello, 'world//\''; // hello world
