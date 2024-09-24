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
    group.className = 'form-group';
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

    // if groupCount aliceblue or fff
    group.style.backgroundColor = groupCount % 2 === 0 ? '#f0f0f0' : 'antiquewhite';
    group.style.padding = '2% 2% 2% 2%';
    group.style.marginBottom = '10%';

    formGroups.appendChild(group);

    const input = group.querySelector('input');
    const textarea = group.querySelector('textarea');

    input.addEventListener('input', validateField);
    input.addEventListener('input', () => updatePrompt(input, textarea));
    input.setAttribute('data-bs-toggle', 'popover');
    input.setAttribute('data-bs-content', '設定產生的章節');
    input.setAttribute('data-bs-placement', 'left');
    textarea.addEventListener('input', validateField);
    textarea.setAttribute('data-bs-toggle', 'popover');
    textarea.setAttribute('data-bs-content', '撰寫與LLM的生成prompt');
    textarea.setAttribute('data-bs-placement', 'left');

    // 添加 input 事件監聽器來觸發自動保存
    input.addEventListener('input', autoSave);
    textarea.addEventListener('input', autoSave);

    // 新增圖表按鈕
    const addChartButton = document.createElement('button');
    addChartButton.type = 'button';
    addChartButton.className = 'btn btn-success btn-sm mb-3 add-chart btn-xl';
    addChartButton.setAttribute('data-bs-toggle', 'popover');
    addChartButton.setAttribute('data-bs-content', '除了文字敘述也可以加入圖表');
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

    // 加入一個水平線
    const horizontalLine = document.createElement('hr');
    // border-top: 4px solid #dc3545;
    // margin-top: 10px;
    horizontalLine.style.borderTop = '4px solid #000';
    horizontalLine.style.marginBottom = '20px';
    group.appendChild(horizontalLine);

    validateForm();

    // 初始化 Popover 並添加自定義行為
    const popoverTriggerList_addChart = group.querySelectorAll('[data-bs-toggle="popover"]');
    popoverTriggerList_addChart.forEach(function (popoverTriggerEl) {
        const popover = new bootstrap.Popover(popoverTriggerEl, {
            trigger: 'manual' // 设置为手动触发
        });
        let hideTimeout;

        popoverTriggerEl.addEventListener('mouseover', function () {
            clearTimeout(hideTimeout);
            popover.show();
        });

        popoverTriggerEl.addEventListener('mouseout', function () {
            hideTimeout = setTimeout(() => {
                popover.hide();
            }, 100);
        });

        popoverTriggerEl.addEventListener('focus', function () {
            clearTimeout(hideTimeout);
            popover.show();
        });

        popoverTriggerEl.addEventListener('blur', function () {
            hideTimeout = setTimeout(() => {
                popover.hide();
            }, 100);
        });
    });

    return group;
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