document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('usageTable');
    const tbody = table.getElementsByTagName('tbody')[0];
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
                const row = tbody.insertRow();
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

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.cellIndex;
            sortTable(table, column);
        });
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const column = parseInt(checkbox.getAttribute('data-column'));
            toggleColumn(column, checkbox.checked);
        });
    });
});

function sortTable(table, column) {
    const tbody = table.getElementsByTagName('tbody')[0];
    const rows = Array.from(tbody.rows);
    const isAscending = table.getAttribute('data-sort-order') === 'asc';
    rows.sort((a, b) => {
        const aText = a.cells[column].textContent;
        const bText = b.cells[column].textContent;
        return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });
    rows.forEach(row => tbody.appendChild(row));
    table.setAttribute('data-sort-order', isAscending ? 'desc' : 'asc');
}

function toggleColumn(column, show) {
    const table = document.getElementById('usageTable');
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
        const cell = row.cells[column];
        if (cell) {
            if (show) {
                cell.classList.remove('hidden');
            } else {
                cell.classList.add('hidden');
            }
        }
    });
}
