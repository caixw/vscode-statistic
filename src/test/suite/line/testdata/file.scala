// SPDX-License-Identifier: MIT

/**
 * 这是一段非 ascii 字符
 */

val hello = """
Hello,"""

object HelloWorld {  
    def main(args: Array[String]) {  
       System.out.println(hello, "World//\"");  // hello world
    }  
 }
