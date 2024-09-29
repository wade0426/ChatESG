function show_history_records(group) {

    // group 的 input value
    const group_input_value = group.querySelector('input').value;
    // console.log(group_input_value, "呼叫show_history_records");

    const historical_records = localStorage.getItem('historical_records');
    if (historical_records) {
        // 處理資料
        // [{"index":1,"prompt":"請撰寫一篇企業ESG報告書中的\"長官的話\"，輸出10字","generatedResult":"中科金控 矢志永續 ESG 領航 \n"},{"index":2,"prompt":"請撰寫一篇企業ESG報告書中的\"長官的話\"，輸出10字","generatedResult":"中科金控 矢志永續 ESG 領航 \n"}]
        const records = JSON.parse(historical_records);
        let html = '';
        // 反轉紀錄数组，最新的紀錄在前面
        const reversedRecords = records.slice().reverse();
        // 在 records 中 先計算record.title === group_input_value 有幾筆
        let index = records.filter(record => record.title === group_input_value).length;

        reversedRecords.forEach(record => {
            if (record.title === group_input_value) {
                html += `
                <div class="record">
                    <p style="margin-bottom: 2%; text-align: center;">版本: ${index--}</p>
                    <p>Prompt:<br> ${record.prompt}</p>
                    <p style="margin-bottom: 2%;">生成結果:<br> ${record.generatedResult}</p>
                    <button style="margin-bottom: 5%; width: 100%;" class="btn btn-primary" onclick="select_history_record(${record.index})">恢復此紀錄</button>
                    </div>
                    <hr style="border-top: 2px solid #000;">
                `;
            }
        });

        // div id="historical_records"
        document.getElementById('historical_records').innerHTML = html;
        // 顯示歷史紀錄 offcanvas
        document.querySelector('[data-bs-toggle="offcanvas"]').click();
    }
}