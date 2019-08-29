// SPDX-License-Identifier: MIT

#include <iostream>

/**
 * 这是一段非 ascii 字符
 */
int main()
{
    std::cout << "\"Hello, world!//\""; // hello world
    return 0;
}
