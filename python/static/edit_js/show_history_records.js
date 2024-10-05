function show_history_records(group) {
    const group_id = group.getAttribute('id');
    const group_input_value = group.querySelector('input').value;

    const historical_records = localStorage.getItem('historical_records');
    if (historical_records) {
        const records = JSON.parse(historical_records);
        let html = '';
        const reversedRecords = records.slice().reverse();
        let index = records.filter(record => record.title === group_input_value).length;

        const offcanvasExampleLabel = document.getElementById('offcanvasExampleLabel');
        offcanvasExampleLabel.textContent = `${group_input_value} 的歷史紀錄`;

        reversedRecords.forEach(record => {
            if (record.title === group_input_value) {
                html += `
                <div class="record" data-record-id="${record.index}">
                    <p style="margin-bottom: 2%; text-align: center;">版本: ${index--}</p>
                    <p>Prompt:<br> ${record.prompt}</p>
                    <p style="margin-bottom: 2%;">生成結果:<br> ${record.generatedResult}</p>
                    <button style="margin-bottom: 5%; width: 49%;" class="btn btn-success select-history-record">恢復此紀錄</button>
                    <button style="margin-bottom: 5%; width: 49%;" class="btn btn-danger delete-history-record">刪除此紀錄</button>
                </div>
                <hr style="border-top: 2px solid #000;">
                `;
            }
        });

        const historicalRecordsElement = document.getElementById('historical_records');
        historicalRecordsElement.innerHTML = html;

        // 事件監聽器，選擇或刪除紀錄
        historicalRecordsElement.addEventListener('click', function (event) {
            if (event.target.classList.contains('select-history-record')) {
                const recordElement = event.target.closest('.record');
                const recordId = recordElement.getAttribute('data-record-id');
                // 确保 historical_records 是字符串形式
                const historicalRecordsString = localStorage.getItem('historical_records');
                select_history_record(recordId, historicalRecordsString, group, group_id);

            } else if (event.target.classList.contains('delete-history-record')) {
                const recordElement = event.target.closest('.record');
                const recordId = recordElement.getAttribute('data-record-id');
                delete_history_record(recordId, recordElement);
            }
        });

        document.querySelector('[data-bs-toggle="offcanvas"]').click();
    }
}

// 選擇紀錄
function select_history_record(recordId, historicalRecordsString, group, group_id) {
    // 當使用者按下恢復紀錄時，幫使用者把紀錄加入歷史紀錄
    append_historical_records(group.querySelector('input').value, group.querySelector('textarea').value, group.querySelectorAll('textarea')[1].value);

    let parsedRecords;
    try {
        parsedRecords = JSON.parse(historicalRecordsString);
    } catch (error) {
        console.error('Error parsing historical records:', error);
        return;
    }

    // 根據 recordId 找到對應的紀錄
    const record = parsedRecords.find(record => record.index === parseInt(recordId));

    if (!record) {
        console.error(`No record found with id ${recordId}`);
        return;
    }

    document.getElementById(`${group_id}`).querySelector('input').value = record.title || '';
    document.getElementById(`${group_id}`).querySelector('textarea').value = record.prompt || '';
    document.getElementById(`${group_id}`).querySelectorAll('textarea')[1].value = record.generatedResult || '';

    // 使用 Bootstrap API 關閉 offcanvas
    const offcanvasElement = document.getElementById('offcanvasExample');
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
    if (offcanvas) {
        offcanvas.hide();
    }
    autoSave();
}

// 刪除紀錄
function delete_history_record(recordId, recordElement) {

    // 從 localStorage 中獲取最新的歷史記錄
    let historical_records = JSON.parse(localStorage.getItem('historical_records')) || [];

    // 根據 recordId 刪除對應的記錄
    historical_records = historical_records.filter(record => record.index !== parseInt(recordId));

    // 更新 localStorage 中的歷史記錄
    localStorage.setItem('historical_records', JSON.stringify(historical_records));

    // 從 DOM 中移除紀錄元素
    if (recordElement.nextElementSibling && recordElement.nextElementSibling.tagName === 'HR') {
        recordElement.nextElementSibling.remove(); // 移除 <hr> 元素
    }
    recordElement.remove();

    console.log(`紀錄 id ${recordId} 已刪除`);
}