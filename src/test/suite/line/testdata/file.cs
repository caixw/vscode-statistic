// SPDX-License-Identifier: MIT

using System;

/**
 * 这是一段非 ascii 字符
 */
class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("\"Hello, world//\""); // hello world
    }
}
