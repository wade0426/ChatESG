// 創建表單組
function createFormGroup(title = '', textarea_value = '') {
    let btnTip = '除了文字敘述也可以加入圖表';
    if (get_btnTip(title)) { btnTip = '建議加入圖表讓整份ESG報告書更加豐富'; }

    console.log("createFormGroup", title, textarea_value);
    infoCount++;
    const group = document.createElement('div');
    group.className = 'form-group mb-5';
    // 添加條件類名來設置背景顏色
    group.style.backgroundColor = infoCount % 2 === 0 ? '#d7d7d8' : '#f0f0f0';
    group.innerHTML = `
        <div class="p-3"> <!-- 添加內邊距 -->
            <div class="form-floating mb-4">
                <input class="form-control" id="title${Date.now()}" type="text" placeholder="Enter title..." value="${title}" required data-bs-toggle="popover" data-bs-trigger="manual" data-bs-placement="left" data-bs-content="${getTips(title)}" />
                <label for="title${Date.now()}">標題</label>
            </div>
            <div class="form-floating mb-4">
                <textarea class="form-control" id="content${Date.now()}" placeholder="Enter content..." style="height: 10rem" required data-bs-toggle="popover" data-bs-trigger="manual" data-bs-placement="left" data-bs-content="${getTips(title)}">${textarea_value}</textarea>
                <label for="content${Date.now()}">內容</label>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-4">
                <button type="button" class="btn btn-primary btn-sm add-chart" data-bs-content="${btnTip}">新增圖表</button>
                <button type="button" class="btn btn-danger btn-sm delete-group">刪除</button>
            </div>
            <div class="charts-container mb-5">
            <!-- 圖表將在這裡動態添加 -->
            </div>
            <hr class="my-4" style="border-top: 4px solid #dc3545;"> <!-- 添加粗一點的黃色水平線 -->
        </div>
    `;
    // style="display:none"
    formFields.appendChild(group);


    // 初始化 Popover 並添加自定義行為
    const popoverTriggerList = [].slice.call(group.querySelectorAll('textarea[data-bs-toggle="popover"]'));
    popoverTriggerList.forEach(function (popoverTriggerEl) {
        const popover = new bootstrap.Popover(popoverTriggerEl);
        let hideTimeout;

        popoverTriggerEl.addEventListener('focus', function () {
            clearTimeout(hideTimeout);
            popover.show();
        });

        // 失去焦點
        popoverTriggerEl.addEventListener('blur', function () {
            hideTimeout = setTimeout(() => {
                popover.hide();
            }, 1000);
        });

        popoverTriggerEl.addEventListener('input', function () {
            clearTimeout(hideTimeout);
            popover.show();
        });
    });


    // 確保新添加的圖表按鈕正常工作
    const addChartButton = group.querySelector('.add-chart');

    // 新增監聽器 add-chart 當使用者把滑鼠放在上面時，會顯示提示訊息 "除了文字，還可以加入圖表"
    // addChartButton.addEventListener('mouseover', function () {
    const popoverTriggerList_addChart = [].slice.call(group.querySelectorAll('.add-chart'));
    popoverTriggerList_addChart.forEach(function (popoverTriggerEl) {
        const popover = new bootstrap.Popover(popoverTriggerEl);
        let hideTimeout;

        popoverTriggerEl.addEventListener('mouseover', function (event) {
            event.stopPropagation(); // 阻止事件冒泡
            clearTimeout(hideTimeout);
            popover.show();
        });

        popoverTriggerEl.addEventListener('mouseout', function (event) {
            event.stopPropagation(); // 阻止事件冒泡
            hideTimeout = setTimeout(() => {
                popover.hide();
            }, 100);
        });

        popoverTriggerEl.addEventListener('input', function (event) {
            event.stopPropagation(); // 阻止事件冒泡
            // clearTimeout(hideTimeout);
            // popover.show();
        });
    });

    // info 關閉 新增圖表功能
    addChartButton.addEventListener('click', function () {
        console.log('新增圖表按鈕被點擊');  // 添加日誌
        const chartsContainer = group.querySelector('.charts-container');
        const newChartContainer = createChartContainer();
        chartsContainer.appendChild(newChartContainer);
        autoSave(); // 添加自動保存
        console.log("新增圖表呼叫自動保存", isInitialLoad);
    });

    group.querySelector('.delete-group').addEventListener('click', function () {
        formFields.removeChild(group);
    });

    const titleInput = group.querySelector('input[type="text"]');
    const contentTextarea = group.querySelector('textarea');

    titleInput.addEventListener('input', autoSave);
    console.log("新增標題呼叫自動保存", isInitialLoad);
    contentTextarea.addEventListener('input', autoSave);
    console.log("新增內容呼叫自動保存", isInitialLoad);

    if (!isInitialLoad) {
        autoSave(); // 只在非初始加載時自動保存
        console.log("新增組呼叫自動保存", isInitialLoad);
    }
    return group; // 返回創建的組元素
}