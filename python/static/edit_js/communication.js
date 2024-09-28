// 用於傳送訊息到py
function generate_word() {
    const formGroups = document.getElementById('form-groups');
    // const groups = formGroups.querySelectorAll('.form-group');
    const groups = JSON.parse(localStorage.getItem('chaptersData'));
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

    fetch('/generate_word', {
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

            alert("word generate success");

            // 測試p標籤
            // console.log(data);
            // document.getElementById('response').textContent = JSON.stringify(data, null, 2);

            // // 使用 LocalStorage
            // localStorage.setItem('response', JSON.stringify(data));

            // 嘗試打開新頁面，如果被封鎖則在當前頁面導航
            function openOrNavigate(url) {
                const newWindow = window.open(url, '_blank');
                if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                    // 彈出窗口被阻擋，在當前頁面導航
                    window.location.href = url;
                }
            }

            // openOrNavigate('/edit');

        })
        .catch(error => {
            console.error('Error:', error);
        });
}



// 當使用者按下"重生成"按鈕時，會執行此函數
function again_generate_response(title, prompt) {
    const formGroups = document.getElementById('form-groups');
    // const groups = formGroups.querySelectorAll('.form-group');
    const groups = JSON.parse(localStorage.getItem('chaptersData'));
    const formFields = document.getElementById('form-fields');
    const infoGroups = formFields.querySelectorAll('.form-group');

    let data = {
        infoCount: infoGroups.length,
        groupCount: groups.length,
        資訊: {},
        標題: title,
        提示: prompt
    };

    // 處理"資訊"部分
    infoGroups.forEach((group) => {
        const title = group.querySelector('input[type="text"]').value;
        const content = group.querySelector('textarea').value;
        data.資訊[title] = content;
    });


    fetch('/again_generate_response', {
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

            alert("response generate success");

            // 測試p標籤
            // console.log(data);
            // document.getElementById('response').textContent = JSON.stringify(data, null, 2);

            // // 使用 LocalStorage
            // localStorage.setItem('response', JSON.stringify(data));

            // 嘗試打開新頁面，如果被封鎖則在當前頁面導航
            function openOrNavigate(url) {
                const newWindow = window.open(url, '_blank');
                if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                    // 彈出窗口被阻擋，在當前頁面導航
                    window.location.href = url;
                }
            }

            // openOrNavigate('/edit');

        })
        .catch(error => {
            console.error('Error:', error);
        });
}