// 所有事件監聽器的設置

// 全域變數 有關 formHandling.js
let groupCount = 0;
let formGroups;
let my_submitButton;

// 全域變數
let infoCount = 0;
const question_area = document.getElementById('question');
const about_area = document.getElementById('about');
const about_next = document.getElementById('about_next');
const contact = document.getElementById('contact');

const formFields = document.getElementById('form-fields');
const addGroupButton = document.getElementById('addGroup');
const industryForm = document.getElementById('industry-form');
const dropdownItems = document.querySelectorAll('.dropdown-item');

// 在文件顶部添加一个新的全局变量
let isInitialLoad = true;

// 修改 autoSave 函数
function autoSave() {
    if (isInitialLoad) return; // 如果是初始加载，不执行自动保存

    const groupsData = [];
    const chaptersData = [];

    // 保存 groups 数据（標題和內容）
    document.getElementById('form-fields').querySelectorAll('.form-group').forEach((group) => {
        const title = group.querySelector('input[type="text"]').value;
        const content = group.querySelector('textarea').value;
        const charts = [];

        group.querySelectorAll('.chart-container').forEach(chartContainer => {
            charts.push({
                description: chartContainer.querySelector('.chart-description').value,
                imageSrc: chartContainer.querySelector('.chart-preview').src
            });
        });

        groupsData.push({ title, content, charts });
    });

    // 保存 chapters 数据（章節和prompt）
    document.getElementById('form-groups').querySelectorAll('.form-group').forEach((group) => {
        const title = group.querySelector('input[type="text"]').value;
        const content = group.querySelector('textarea').value;
        chaptersData.push({ title, content });
    });

    localStorage.setItem('groupsData', JSON.stringify(groupsData));
    console.log("groupsData", groupsData);
    localStorage.setItem('chaptersData', JSON.stringify(chaptersData));

    // 保存選擇的行業類別
    const activeIndustry = document.querySelector('.dropdown-item.active');
    if (activeIndustry) {
        localStorage.setItem('selectedIndustry', activeIndustry.id);
    }
}

// 創建表單組
function createFormGroup(title = '', textarea_value = '') {
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
                <button type="button" class="btn btn-primary btn-sm add-chart">新增圖表</button>
                <button type="button" class="btn btn-danger btn-sm delete-group">刪除</button>
            </div>
            <div class="charts-container mb-5">
            <!-- 圖表將在這裡動態添加 -->
            </div>
            <hr class="my-4" style="border-top: 4px solid #dc3545;"> <!-- 添加粗一點的黃色水平線 -->
        </div>
    `;
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

    // 确保新添加的图表按钮正常工作
    const addChartButton = group.querySelector('.add-chart');
    addChartButton.addEventListener('click', function () {
        console.log('新增圖表按钮被点击');  // 添加日志
        const chartsContainer = group.querySelector('.charts-container');
        const newChartContainer = createChartContainer();
        chartsContainer.appendChild(newChartContainer);
        autoSave(); // 添加自动保存
        console.log("新增圖表呼叫自動保存", isInitialLoad);
    });

    group.querySelector('.delete-group').addEventListener('click', function () {
        formFields.removeChild(group);
    });

    const titleInput = group.querySelector('input[type="text"]');
    const contentTextarea = group.querySelector('textarea');

    titleInput.addEventListener('blur', autoSave);
    console.log("新增標題呼叫自動保存", isInitialLoad);
    contentTextarea.addEventListener('blur', autoSave);
    console.log("新增內容呼叫自動保存", isInitialLoad);

    if (!isInitialLoad) {
        autoSave(); // 只在非初始加载时自动保存
        console.log("新增組呼叫自動保存", isInitialLoad);
    }
    // return group; // 返回创建的组元素
}

// 创建图表容器
function createChartContainer() {
    console.log('创建新的图表容器');  // 添加日志
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container mb-3';
    chartContainer.innerHTML = `
        <div class="row g-2">
            <div class="col-md-6 d-flex flex-column justify-content-center" style="background-color: white;">
                <div class="mb-3">設定圖表</div>
                <div class="form-floating mb-3">
                    <textarea class="form-control chart-description" placeholder="Enter chart description..." style="height: 5rem"></textarea>
                    <label>圖表描述</label>
                </div>
                <div class="mb-3">
                    <button type="button" class="btn btn-secondary btn-sm test-chart me-1">測試</button>
                    <button type="button" class="btn btn-danger btn-sm remove-chart">移除圖表</button>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card h-100">
                    <img src="../static/index_js/image/picture_file.png" class="card-img-top chart-preview" alt="圖表預覽" style="cursor: pointer; width: 100%; height: 300px; object-fit: contain;">
                    <div class="card-body p-3">
                        <p class="card-text chart-preview-text mb-0"></p>
                    </div>
                </div>
                <input class="form-control chart-upload mt-2" type="file" accept="image/*" style="display: none;">
            </div>
        </div>
    `;

    // 添加图表描述输入事件
    const chartDescription = chartContainer.querySelector('.chart-description');
    const chartPreviewText = chartContainer.querySelector('.chart-preview-text');

    chartDescription.addEventListener('input', function () {
        chartPreviewText.textContent = this.value;
        autoSave(); // 添加自动保存
        console.log("新增圖表描述呼叫自動保存", isInitialLoad);
    });

    // 添加移除圖表按鈕的事件監聽器
    chartContainer.querySelector('.remove-chart').addEventListener('click', function () {
        console.log('移除图表按钮被点击');  // 添加日志
        chartContainer.remove();
        autoSave(); // 在移除图表后自动保存
        console.log("移除圖表呼叫自動保存", isInitialLoad);
    });

    // 添加图片点击和文件上传事件
    const chartPreview = chartContainer.querySelector('.chart-preview');
    const chartUpload = chartContainer.querySelector('.chart-upload');

    chartPreview.addEventListener('click', function () {
        chartUpload.click();
    });

    chartUpload.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                chartPreview.src = e.target.result;
                chartPreview.style.objectFit = 'contain';
                autoSave(); // 在圖片上傳後自動保存
            };
            reader.readAsDataURL(file);

            // 輸出圖片路徑到控制台
            console.log('圖片路徑:', file.name);
        }
    });

    chartDescription.addEventListener('blur', autoSave);

    return chartContainer;
}

// 清除表單字段
function clearFormFields() {
    formFields.innerHTML = '';
}

// 顯示行業表單
function showIndustryForm() {
    industryForm.style.display = 'block';
}

// 修改 restoreFormData 函数
function restoreFormData(title) {
    isInitialLoad = true; // 開始恢復數據時設置標誌

    // 恢復數據
    const savedGroupsData = localStorage.getItem('groupsData');
    const savedChaptersData = localStorage.getItem('chaptersData');
    const savedIndustry = localStorage.getItem('selectedIndustry');

    const groupsData = JSON.parse(savedGroupsData);

    // 恢復選擇的行業
    if (savedIndustry) {
        const industryElement = document.getElementById(savedIndustry);
        if (industryElement) {
            industryElement.click(); // 觸發點擊事件以恢復行業選擇
        }
    }

    // 恢復資訊數據
    // 對 groupsData 迭代
    groupsData.forEach((groupData) => {
        createFormGroup(groupData.title, groupData.content);
    });

    // 恢復章節數據
    if (savedChaptersData) {
        const chaptersData = JSON.parse(savedChaptersData);

        chaptersData.forEach((chapterData) => {
            createGroup(chapterData.title, '', '', chapterData.content);
        });
    }

    isInitialLoad = false; // 恢復數據完成後重置標誌
}

// 修改 initializeForm 函数
function initializeForm() {
    isInitialLoad = true; // 開始初始化時設置標誌

    const savedGroupsData = localStorage.getItem('groupsData');
    const savedChaptersData = localStorage.getItem('chaptersData');
    const savedIndustry = localStorage.getItem('selectedIndustry');

    if (savedGroupsData || savedChaptersData || savedIndustry) {
        restoreFormData();
    } else {
        // 如果沒有保存的數據，則創建默認的 form group 和 chapter groups
        createFormGroup();

    }

    // 如果有保存的行業，顯示行業表單
    if (savedIndustry) {
        showIndustryForm();
    }

    isInitialLoad = false; // 初始化完成後重置標誌
}

// 設置行業類別的點擊事件
dropdownItems.forEach(item => {
    item.addEventListener('click', function (event) {
        event.preventDefault();
        clearFormFields();
        showIndustryForm();

        // 移除 display: none 的屬性
        question_area.style.paddingBottom = '0%';
        about_next.style.display = 'math';
        about_area.style.display = 'block';
        contact.style.display = 'block';

        // 去 #contact
        window.location.href = "#about";

        // isInitialLoad == true 時 不執行 因為在恢復數據
        if (!isInitialLoad) {
            const industry = this.id.split('-')[1];
            if (industry === 'finance') {
                createFormGroup('公司名稱');
                createFormGroup('成立時間');
                // 建立章節
                createGroup('關於本報告書', '', 'is-invalid', "");
                createGroup('長官的話', '', '', getPrompt('長官的話'));
                createGroup('關於公司', '', 'is-invalid', "");
                createGroup('永續發展策略', '', 'is-invalid', "");
                createGroup('公司治理', '', 'is-invalid', "");
                createGroup('永續金融', '', 'is-invalid', "");
                createGroup('永續環境', '', 'is-invalid', "");
                createGroup('員工關懷', '', 'is-invalid', "");
            }
            else if (industry === 'education') {
                createFormGroup('學校名稱');
                createFormGroup('課程');
                // 建立章節
                createGroup('關於本報告書', '', 'is-invalid', "");

            }
            else {
                createFormGroup();
            }
        }

        // 初始化所有 Popover
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });

        // 設置當前選中的行業
        dropdownItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        autoSave(); // 在選擇行業後自動保存
    });
});

// 修改添加组按钮事件
const addDataButton = document.getElementById('addData');
addDataButton.addEventListener('click', () => {
    console.log('添加新資料按鈕被點擊');
    createFormGroup();
    autoSave(); // 添加自動保存
});

// 确保在 DOM 加载完成后初始化所有事件监听器
document.addEventListener('DOMContentLoaded', () => {
    // 初始化表單處理 有關formHandling.js
    initializeFormHandling();

    // 驗證表單 是否為空
    validateForm();

    // 初始化表单
    initializeForm();
});

// 监听提交按钮
document.getElementById('my_submitButton').addEventListener('click', function (event) {
    event.preventDefault();  // 防止表單默認提交
    // 先檢查是否所有群組都有填寫標題和內容 不要有空字串""
    const formGroups = document.getElementById('form-groups');
    const groups = formGroups.querySelectorAll('.form-group');
    let valid = true;
    groups.forEach((group) => {
        const title = group.querySelector('input[type="text"]').value;
        const content = group.querySelector('textarea').value;
        if (title === '' || content === '') {
            valid = false;
        }
    });
    if (!valid) {
        alert('請填寫所有群組的標題和內容！');
        return;
    }
    else {
        // alert('提交成功！');
        document.getElementById('wating_start-btn').click();

        // 將所有input標籤 和 text 加入disabled屬性，避免重複提交
        const inputs = document.querySelectorAll('input');
        const textareas = document.querySelectorAll('textarea');
        inputs.forEach((input) => {
            input.disabled = true;
        });
        textareas.forEach((textarea) => {
            textarea.disabled = true;
        });

        // console.log(valid);
        sendMessage();
    }
});

// 清除本地存储的按钮
const clearStorageButton = document.createElement('button');
clearStorageButton.textContent = '清除保存的数据';
clearStorageButton.addEventListener('click', () => {
    localStorage.removeItem('groupsData');
    localStorage.removeItem('chaptersData');
    localStorage.removeItem('selectedIndustry');
    location.reload();
});
document.body.appendChild(clearStorageButton);