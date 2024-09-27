document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('usageTable').getElementsByTagName('tbody')[0];
    const checkboxes = document.querySelectorAll('.column-toggle');
    const headers = document.querySelectorAll('th');
    const usageCountElement = document.getElementById('usageCount');
    const totalCostElement = document.getElementById('totalCost');

    fetch('record.txt')
        .then(response => response.text())
        .then(data => {
            const lines = data.trim().split('\n');
            let totalCost = 0;
            lines.forEach(line => {
                const row = table.insertRow();
                const cells = line.split(', ');
                cells.forEach((cell, index) => {
                    const cellElement = row.insertCell(index);
                    cellElement.textContent = cell;
                });
                totalCost += parseFloat(cells[3]); // 總價格在第4列
            });
            usageCountElement.textContent = lines.length;
            totalCostElement.textContent = totalCost.toFixed(6); // 顯示到小數點後六位
            sortTable(table, 0); // 預設按時間排序
        });
});

headers.forEach(header => {
    header.addEventListener('click', () => {
        const column = header.getAttribute('data-column');
        sortTable(table, column);
    });
});

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const column = checkbox.getAttribute('data-column');
        toggleColumn(column, checkbox.checked);
    });
});

function sortTable(table, column) {
    const rows = Array.from(table.rows);
    const isAscending = table.getAttribute('data-sort-order') === 'asc';
    rows.sort((a, b) => {
        const aText = a.cells[column].textContent;
        const bText = b.cells[column].textContent;
        return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });
    rows.forEach(row => table.appendChild(row));
    table.setAttribute('data-sort-order', isAscending ? 'desc' : 'asc');
}

function toggleColumn(column, show) {
    const cells = document.querySelectorAll(`td:nth-child(${parseInt(column) + 1}), th:nth-child(${parseInt(column) + 1})`);
    cells.forEach(cell => {
        cell.style.display = show ? '' : 'none';
    });
}
