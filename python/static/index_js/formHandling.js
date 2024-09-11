let groupCount = 0;
let formGroups;
let addGroupButton;
let my_submitButton;

function initializeFormHandling() {
    formGroups = document.getElementById('form-groups');
    addGroupButton = document.getElementById('addGroup');
    my_submitButton = document.getElementById('my_submitButton');

    addGroupButton.addEventListener('click', () => {
        createGroup();
    });
}


function createGroup(title = '', className_title = 'is-invalid', className_content = 'is-invalid', demo_text = '') {
    groupCount++;
    const group = document.createElement('div');
    group.className = 'form-group mb-3';
    group.innerHTML = `
        <div class="form-floating mb-3">
            <input value="${title}" class="form-control ${className_title}" id="name${groupCount}" type="text"
                placeholder="Enter your name..." data-sb-validations="required" />
            <label for="name${groupCount}">章節</label>
            <div class="invalid-feedback" data-sb-feedback="name${groupCount}:required">必填</div>
        </div>
        <div class="form-floating mb-3">
            <textarea class="form-control ${className_content}" id="message${groupCount}" placeholder="Enter your message here..." style="height: 10rem"
                data-sb-validations="required">${demo_text}</textarea>
            <label for="message${groupCount}">Prompt</label>
            <div class="invalid-feedback" data-sb-feedback="message${groupCount}:required">必填</div>
        </div>
        <button type="button" class="btn btn-danger btn-sm mb-3 delete-group btn-xl" style="padding: 1% 5% 1% 5%">删除</button>
    `;
    formGroups.appendChild(group);

    const input = group.querySelector('input');
    const textarea = group.querySelector('textarea');

    input.addEventListener('input', validateField);
    input.addEventListener('input', () => updatePrompt(input, textarea));
    textarea.addEventListener('input', validateField);

    group.querySelector('.delete-group').addEventListener('click', function () {
        formGroups.removeChild(group);
        groupCount--;
        validateForm();
    });

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

// 導出需要在其他地方使用的函数
// updatePrompt
export { initializeFormHandling, createGroup, validateField, validateForm, updatePrompt };