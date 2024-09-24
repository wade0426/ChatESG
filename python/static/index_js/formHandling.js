// 全域變數 定義在 eventListeners.js

function initializeFormHandling() {
    formGroups = document.getElementById('form-groups');
    // addGroupButton = document.getElementById('addGroup');
    my_submitButton = document.getElementById('my_submitButton');

    addGroupButton.addEventListener('click', () => {
        createGroup();
    });
}


function createGroup(title = '', demo_text = '') {
    let className_title = '';
    let className_content = '';
    if (title === '') className_title = 'is-invalid';
    if (demo_text === '') className_content = 'is-invalid';

    groupCount++;
    const group = document.createElement('div');
    group.className = 'form-group mb-3';
    group.innerHTML = `
        <div class="form-floating mb-3" style="width: 100%;">
            <input value="${title}" class="form-control ${className_title}" id="name${groupCount}" type="text"
                placeholder="Enter your name..." data-sb-validations="required" />
            <label for="name${groupCount}">章節</label>
            <div class="invalid-feedback" data-sb-feedback="name${groupCount}:required">必填</div>
        </div>
        <div class="form-floating mb-3" style="width: 100%;">
            <textarea class="form-control ${className_content}" id="message${groupCount}" placeholder="Enter your message here..." style="height: 10rem"
                data-sb-validations="required">${demo_text}</textarea>
            <label for="message${groupCount}">Prompt</label>
            <div class="invalid-feedback" data-sb-feedback="message${groupCount}:required">必填</div>
        </div>
    `;
    formGroups.appendChild(group);

    const input = group.querySelector('input');
    const textarea = group.querySelector('textarea');

    input.addEventListener('input', validateField);
    input.addEventListener('input', () => updatePrompt(input, textarea));
    textarea.addEventListener('input', validateField);

    // 添加 input 事件監聽器來觸發自動保存
    input.addEventListener('input', autoSave);
    textarea.addEventListener('input', autoSave);

    // 新增圖表按鈕
    const addChartButton = document.createElement('button');
    addChartButton.type = 'button';
    addChartButton.className = 'btn btn-success btn-sm mb-3 add-chart btn-xl';
    addChartButton.textContent = '新增圖表';
    addChartButton.style.padding = '1% 5% 1% 5%';

    // 刪除按鈕
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn btn-danger btn-sm mb-3 delete-group btn-xl';
    deleteButton.textContent = '删除';
    deleteButton.style.padding = '1% 5% 1% 5%';

    // 按鈕容器
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'd-flex justify-content-between mb-3';

    // 將按鈕添加到按鈕容器
    buttonContainer.appendChild(addChartButton);
    buttonContainer.appendChild(deleteButton);

    // 添加圖表容器
    const chartsContainer = document.createElement('div');
    chartsContainer.className = 'charts-container mb-3';

    // 將按鈕容器和圖表容器添加到組中
    group.appendChild(buttonContainer);
    group.appendChild(chartsContainer);

    // 新增圖表按鈕事件
    addChartButton.addEventListener('click', function () {
        const newChartContainer = createChartContainer();
        chartsContainer.appendChild(newChartContainer);
        autoSave(); // 添加自動保存
    });

    // 刪除按鈕事件
    deleteButton.addEventListener('click', function () {
        formGroups.removeChild(group);
        groupCount--;
        validateForm();
        console.log('刪除後自動保存');
        autoSave(); // 刪除後自動保存
    });

    return group;

    validateForm();
}

// 檢查當前輸入框是否為空
function validateField() {
    if (this.value.trim() === '') {
        this.classList.add('is-invalid');
    } else {
        this.classList.remove('is-invalid');
    }
    // 驗證表單
    validateForm();
}


function validateForm() {
    // 獲取所有表單組
    const groups = formGroups.querySelectorAll('.form-group');
    // 初始化表單驗證狀態為有效
    let isValid = true;

    // 遍歷每個表單組
    groups.forEach((group) => {
        // 獲取當前組的輸入框和文本區域
        const input = group.querySelector('input');
        const textarea = group.querySelector('textarea');

        // 檢查輸入框和文本區域是否為空
        // 如果任一為空，則將表單狀態設為無效
        if (input.value.trim() === '' || textarea.value.trim() === '') {
            isValid = false;
        }
    });

    // 根據表單驗證狀態設置提交按鈕的禁用狀態
    // 如果表單無效，則禁用提交按鈕；否則啟用
    my_submitButton.disabled = !isValid;
}

// 更新prompt
function updatePrompt(input, textarea) {
    const title = input.value.trim();
    const prompt = getPrompt(title);
    if (prompt) {
        textarea.value = prompt;
        textarea.classList.remove('is-invalid');
    }
    // 驗證表單 是否為空
    validateForm();
}