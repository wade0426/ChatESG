// 加入歷史紀錄
// 第一次進入edit 和 edit_communication.js 會呼叫這個函數
function append_historical_records(title, prompt, generatedResult) {
    // 定義historical_records
    let records = JSON.parse(localStorage.getItem('historical_records')) || [];

    // 如果紀錄已經存在，則不加入
    if (records.some(record => record.title === title && record.prompt === prompt && record.generatedResult === generatedResult)) {
        console.log('紀錄已存在');
        return;
    }

    const newRecord = {
        index: records.length + 1,
        title: title,
        prompt: prompt,
        generatedResult: generatedResult
    };

    records.push(newRecord);

    localStorage.setItem('historical_records', JSON.stringify(records));
}