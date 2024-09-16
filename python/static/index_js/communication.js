// 用於傳送訊息到py
// 傳送的訊息要包含 infoCount 和 groupCount 這個變數，以及每個群組的標題和內容
// 請注意處理動態個 infoCount 和 groupCount因為使用者可能會新增或刪除
// 傳送所有群組的標題和內容
// 給py的資料 JSON 格式應該是這樣：{"infoCount":"X","groupCount":"X","資訊":{"公司名稱":"臺灣產物保險股份有限公司","成立時間":"1990年","報告年度":"2024年"},"章節":{"group1":{"title":"前言","content":"內容"},"group2":{"title":"關於公司","content":"內容"},"group3":{"title":"公司治理","content":"內容"}}}
function sendMessage() {
    const formGroups = document.getElementById('form-groups');
    const groups = formGroups.querySelectorAll('.form-group');
    const formFields = document.getElementById('form-fields');
    const infoGroups = formFields.querySelectorAll('.form-group');

    let data = {
        infoCount: infoGroups.length,
        groupCount: groups.length,
        資訊: {},
        章節: {}
    };

    // 處理"資訊"部分
    infoGroups.forEach((group) => {
        const title = group.querySelector('input[type="text"]').value;
        const content = group.querySelector('textarea').value;
        data.資訊[title] = content;
        // console.log(data);

    });

    // 處理"章節"部分
    groups.forEach((group, index) => {
        const title = group.querySelector('input[type="text"]').value;
        const content = group.querySelector('textarea').value;
        data.章節[`group${index + 1}`] = {
            title: title,
            content: content
        };
        // console.log(data);
        localStorage.setItem('edit', JSON.stringify(data));
        // console.log(localStorage.getItem('edit'));
    });

    // console.log(data);

    fetch('/send_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            // 關閉等待提示
            document.getElementById('wating_cancel-btn').click();

            // 測試p標籤
            console.log(data);
            document.getElementById('response').textContent = JSON.stringify(data, null, 2);

            // 使用 LocalStorage
            localStorage.setItem('response', JSON.stringify(data));

            // 打開main頁面
            // 打開main頁面
            // 嘗試打開新頁面，如果被封鎖則在當前頁面導航
            function openOrNavigate(url) {
                const newWindow = window.open(url, '_blank');
                if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                    // 彈出窗口被阻擋，在當前頁面導航
                    window.location.href = url;
                }
            }

            // 打開main頁面
            openOrNavigate('/main');

            // 打開edit頁面
            openOrNavigate('/edit');

            // 關閉當前index頁面
            // window.close();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}