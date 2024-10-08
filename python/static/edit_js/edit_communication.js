// 用於傳送訊息到py 當按下"下載成檔案"按鈕時，會執行此函數
function generate_word() {
    const formGroups = document.getElementById('form-groups');
    // const groups = formGroups.querySelectorAll('.form-group');
    const groups = JSON.parse(localStorage.getItem('chaptersData'));
    const formFields = document.getElementById('form-fields');
    const infoGroups = formFields.querySelectorAll('.form-group');

    let data = {
        // infoCount: infoGroups.length,
        groupCount: groups.length,
        // 資訊: {},
        章節: {}
    };

    // 處理"資訊"部分
    // infoGroups.forEach((group) => {
    //     const title = group.querySelector('input[type="text"]').value;
    //     const content = group.querySelector('textarea').value;
    //     data.資訊[title] = content;
    //     // console.log(data);

    // });

    // 處理"章節"部分
    groups.forEach((group, index) => {
        console.log(group);
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
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'generated_report.docx';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            // 關閉模態框並重置滾動狀態
            const modal = document.getElementById('staticBackdrop');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }

            // 使用 setTimeout 確保在模態框完全關閉後執行清理
            setTimeout(() => {
                cleanupModalEffects();
            }, 500);
        })
        .catch(error => {
            console.error('Error:', error);
            cleanupModalEffects(); // 即使出錯也嘗試清理
        });
}



// 當使用者按下"重新生成"按鈕時，會執行此函數
function again_generate_response(group) {
    document.getElementById("wating_start-btn").click();
    const formGroups = document.getElementById('form-groups');
    const groups = JSON.parse(localStorage.getItem('chaptersData'));
    const formFields = document.getElementById('form-fields');
    const infoGroups = formFields.querySelectorAll('.form-group');

    let data = {
        infoCount: infoGroups.length,
        groupCount: groups.length,
        info: {},
        title: group.querySelector('input[type="text"]').value,
        prompt: group.querySelector('textarea').value
    };

    // 處理"資訊"部分
    infoGroups.forEach((group) => {
        const title = group.querySelector('input[type="text"]').value;
        const content = group.querySelector('textarea').value;
        data.info[title] = content;
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
            console.log(data);

            group.querySelectorAll('textarea')[1].value = data.generatedResult;

            autoSave();

            // 歷史紀錄
            append_historical_records(group.querySelector('input').value, group.querySelectorAll('textarea')[0].value, group.querySelectorAll('textarea')[1].value);

            // 關閉模態框並重置滾動狀態
            const modal = document.getElementById('staticBackdrop');
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }

            // 使用 setTimeout 確保在模態框完全關閉後執行清理
            setTimeout(() => {
                cleanupModalEffects();
            }, 800);
        })
        .catch(error => {
            console.error('Error:', error);
            cleanupModalEffects(); // 即使出錯也嘗試清理
        });
}

// 新增函數用於清理模態框效果
function cleanupModalEffects() {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    // 移除模態框背景
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.remove();
    }

    // 重置所有滾動容器
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });

    // 強制重新計算佈局
    window.dispatchEvent(new Event('resize'));
}