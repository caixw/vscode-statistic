// SPDX-License-Identifier: MIT

'use strict';

window.addEventListener('load', (e) => {
    // 页面加载完之后，开始请求数据。
    const vscode = acquireVsCodeApi();

    vscode.postMessage({
        type: 'refresh',
    });

    initSortTable();
});

window.addEventListener('message', (e) => {
    const msg = e.data;
    switch (msg.type) {
        case 'file':
            appendFileTypes(msg.data);
            break;
        case 'end':
            end();
            break;
        default:
            console.error(`无效的消息类型${msg.type}`);
    }
});

function appendFileTypes(types) {
    if (types.types.length === 0) {
        document.querySelector('#file-types>.no-data').style.display = 'block';
        document.querySelector('#file-types>table').style.display = 'none';
        return;
    }

    const table = document.querySelector('#file-types>table');

    const tbody = table.querySelector('tbody');
    for (const line of types.types) {
        const tr = tbody.appendChild(document.createElement('tr'));
        appendFileTypeToTr(tr, line);
    }

    appendFileTypeToTr(table.querySelector('tfoot>tr'), types.total);
}

function end() {
    // TODO
}

function appendFileTypeToTr(tr, type) {
    tr.appendChild(document.createElement('th')).append(type.name);
    tr.appendChild(document.createElement('td')).append(type.files);
    tr.appendChild(document.createElement('td')).append(type.lines);
    tr.appendChild(document.createElement('td')).append(type.avg);
    tr.appendChild(document.createElement('td')).append(type.max);
    tr.appendChild(document.createElement('td')).append(type.min);
}

/**
 * 对所有的 table 元素添加排序功能
 * 
 * 目前支持在 thead>th 上使用以下三种自定义功能：
 * - data-asc 表示当前列为升序排列，只允许在一列使用；
 * - data-type 表示该列的值类型，可以是 string 和 number，
 *   默认为 number，该属性会影响排序方式；
 * - data-index 由代码自动生成，无需也不能人工干预；
 */
function initSortTable() {
    const tables = document.querySelectorAll('table');

    tables.forEach((table) => {
        const ths = table.querySelectorAll('thead>tr>th');
        ths.forEach((th, index) => {
            th.setAttribute('data-index', index);
            th.addEventListener('click', (e) => {
                const th = e.target;
                const asc = !(/true/.test(th.getAttribute('data-asc')));
                const index = parseInt(th.getAttribute('data-index'));
                const table = th.parentNode.parentNode.parentNode;
                th.setAttribute('data-asc', asc);

                let cmp = numberCompare;
                if (th.getAttribute('data-type') === 'string') {
                    cmp = stringCompare;
                }
                sortTable(table, index, asc, cmp);

                // 去掉其它元素的 asc 属性
                th.parentNode.querySelectorAll('th').forEach((val, i)=>{
                    if (index !== i) {
                        val.setAttribute('data-asc', 'none');
                    }
                })
            }) // end onclick
        })
    }) // end tables.forEach
}

/**
 * 对表进行排序，仅处理 tbody 中的内容
 *
 * @param {HTMLTableElement} table 需要排序的表元素
 * @param {number} colIndex 按第几列进行排序
 * @param {boolean} asc 是否倒序
 * @param {function} cmp 比较函数，目前支持字符串和数值
 */
function sortTable(table, colIndex, asc, cmp) {
    let rows = [];

    table.querySelectorAll('tbody>tr').forEach((row) => {
        rows.push(row);
    })


    rows = rows.sort((row1, row2) => {
        const v1 = row1.cells.item(colIndex).innerHTML.toLowerCase();
        const v2 = row2.cells.item(colIndex).innerHTML.toLowerCase();

        if (asc) {
            return cmp(v1, v2);
        }
        return cmp(v2, v1);
    })

    const p = rows[0].parentNode;
    for (const row of rows) {
        p.appendChild(row);
    }
}

function numberCompare(v1, v2) {
    return v1 - v2;
}

function stringCompare(v1, v2) {
    return v1.localeCompare(v2);
}
