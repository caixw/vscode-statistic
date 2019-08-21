// SPDX-License-Identifier: MIT

window.addEventListener('load', (e) => {
    // 页面加载完之后，开始请求数据。
    const vscode = acquireVsCodeApi();

    vscode.postMessage({
        type: 'refresh',
    });
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
