// 創建表單組
function createFormGroup(title = '', textarea_value = '') {
    // 将 formFields 的获取移到函数内部
    const formFields = document.getElementById('form-fields');
    if (!formFields) {
        console.error('formFields element not found');
        return;
    }

    console.log("createFormGroup", title, textarea_value);
    infoCount++;
    const group = document.createElement('div');
    group.className = 'form-group mb-5';
    // 添加條件類名來設置背景顏色
    group.style.backgroundColor = infoCount % 2 === 0 ? '#d7d7d8' : '#f0f0f0';
    group.innerHTML = `
        <div class="p-3"> <!-- 添加內邊距 -->
            <div class="form-floating mb-4">
                <input class="form-control" id="title${Date.now()}" type="text" placeholder="Enter title..." value="${title}" required data-bs-toggle="popover" data-bs-trigger="manual" data-bs-placement="left" data-bs-content="" />
                <label for="title${Date.now()}">標題</label>
            </div>
            <div class="form-floating mb-4">
                <textarea class="form-control" id="content${Date.now()}" placeholder="Enter content..." style="height: 10rem" required data-bs-toggle="popover" data-bs-trigger="manual" data-bs-placement="left" data-bs-content="">${textarea_value}</textarea>
                <label for="content${Date.now()}">內容</label>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-4">
                <button style="display:none" type="button" class="btn btn-primary btn-sm add-chart" data-bs-content="">新增圖表</button>
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

// 修改這個函数
function showIndustryForm() {
    const industryForm = document.getElementById('industry-form');
    if (industryForm) {
        // 移除這一行，因為我們現在使用 Bootstrap 的 collapse 功能
        // industryForm.style.display = 'block';
    }
}
