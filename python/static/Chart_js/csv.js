// 將 CSV 轉換為 JSON 格式的函數
function csvToJson(csvString, fileName) {
    const lines = csvString.split('\n');
    const headers = lines[0].split(',');
    const data = {};

    headers.forEach(header => {
        data[header.trim()] = [];
    });

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',');
        headers.forEach((header, index) => {
            data[header.trim()].push(isNaN(currentLine[index]) ? currentLine[index].trim() : Number(currentLine[index]));
        });
    }

    return {
        "Chart Title": fileName.replace('.csv', ''),
        "Quantity": lines.length - 1,
        "X-Label": headers[0].trim(),
        "Y-Label": headers[1].trim(),
        "data": data
    };
}

// 處理檔案
function Processing_file(fileInput) {
    return new Promise((resolve, reject) => {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            const csvString = event.target.result;
            const jsonData = csvToJson(csvString, file.name);
            console.log(jsonData);
            resolve(jsonData);
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

// 建立圖表
// elements_tr 是表格的 tr 元素
function createChart(jsonData, addDataRow, elements_tr) {
    console.log(jsonData['Chart Title']);
    // 設定圖表的標題
    document.getElementById('chart-title').value = jsonData['Chart Title'];
    // 設定要添加資料的次數
    for (let i = 0; i < jsonData['Quantity']; i++) {
        addDataRow();
    }
    // 設定X軸的標題
    document.getElementById('x-axis-title').value = jsonData['X-Label'];
    // 設定Y軸的標題
    document.getElementById('y-axis-title').value = jsonData['Y-Label'];
    // 設定圖表的數據
    // 保持是輸入框，輸入框自動填入資料
    const rows = elements_tr;
    const xValues = jsonData.data[jsonData['X-Label']];
    const yValues = jsonData.data[jsonData['Y-Label']];
    for (let i = 0; i < rows.length; i++) {
        const inputs = rows[i].getElementsByTagName('input');
        inputs[0].value = xValues[i] || '';
        inputs[1].value = yValues[i] || '';
    }
}