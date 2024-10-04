// 用於傳送訊息到py
function sendMessage() {
    const formGroups = document.getElementById('form-groups');
    const groups = JSON.parse(localStorage.getItem('chaptersData'));
    const formFields = document.getElementById('form-fields');
    const infoGroups = formFields.querySelectorAll('.form-group');

    let data = {
        infoCount: infoGroups.length,
        groupCount: groups.length,
        資訊: [],
        章節: {}
    };

    // 處理"資訊"部分
    infoGroups.forEach((group, index) => {
        const title = group.querySelector('input[type="text"]').value;
        const content = group.querySelector('textarea').value;
        data.資訊[index] = { title: title, content: content };
    });

    // 處理"章節"部分
    groups.forEach((group, index) => {
        data.章節[`group${index + 1}`] = {
            title: group.title,
            prompt: group.prompt,
            generatedResult: group.generatedResult,
            charts: group.charts
        };
        // console.log(data);
        // localStorage.setItem('edit', JSON.stringify(data));
        // console.log(localStorage.getItem('edit'));
    });

    // console.log(data);

    console.log('送出 data:', data);
    fetch('/send_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify(data),
        body: JSON.stringify(data),

    })
        .then(response => response.json())
        .then(data => {
            // 關閉等待提示
            document.getElementById('wating_cancel-btn').click();

            console.log(data);

            // 測試p標籤
            // console.log(data);
            // 轉換為格式化的 JSON 字符串，並顯示在頁面上
            // 1. JSON.stringify(data, null, 2) 將 data 對象轉換為 JSON 字符串
            //    - 第二個參數 null 表示不替換任何值
            //    - 第三個參數 2 表示使用 2 個空格進行縮進，使輸出更易讀
            // 2. document.getElementById('response') 獲取 ID 為 'response' 的 HTML 元素
            // 3. .textContent 將格式化後的 JSON 字符串設置為該元素的文本內容
            document.getElementById('response').textContent = JSON.stringify(data, null, 2);

            // 使用 LocalStorage
            localStorage.setItem('response', JSON.stringify(data));

            // 嘗試打開新頁面，如果被封鎖則在當前頁面導航
            function openOrNavigate(url) {
                const newWindow = window.open(url, '_blank');
                if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                    // 彈出窗口被阻擋，在當前頁面導航
                    window.location.href = url;
                }
            }

            // 打開main頁面
            // openOrNavigate('/main');

            // 打開edit頁面
            // openOrNavigate('/edit');
            // window.location.href = '/edit';

            // 關閉當前index頁面
            // window.close();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}