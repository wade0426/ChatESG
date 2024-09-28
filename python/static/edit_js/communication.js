// 用於傳送訊息到py
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
    });

    // 處理"章節"部分
    groups.forEach((group, index) => {
        const title = group.querySelector('input[type="text"]').value;
        const content = group.querySelector('textarea').value;
        data.章節[`group${index + 1}`] = {
            title: title,
            content: content
        };
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
            // 顯示回應訊息
            // alert("取得回應！");
            document.getElementById('wating_cancel-btn').click();

            // 測試p標籤
            console.log(data);
            data_json = JSON.stringify(data, null, 2);
            document.getElementById('response').textContent = data_json;

            // 使用 LocalStorage
            localStorage.setItem('response', data_json);
            // 改變網頁位置
            // window.location.href = "/main";

            // 開啟一個新的視窗
            // window.open("/edit", "_blank");
            alert(data_json);

            // 測試
            // console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}