// 包含所有事件監聽器的設置

// 當 DOM 加載完成後執行初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化表單處理 有關formHandling.js
    initializeFormHandling();

    // 在這裡添加其他的事件監聽器或函數調用
    createGroup('關於本報告書', '', 'is-invalid', "");
    createGroup('長官的話', '', '', getPrompt('長官的話'));
    createGroup('關於公司', '', 'is-invalid', "");
    createGroup('永續發展策略', '', 'is-invalid', "");
    createGroup('公司治理', '', 'is-invalid', "");
    createGroup('永續金融', '', 'is-invalid', "");
    createGroup('永續環境', '', 'is-invalid', "");
    createGroup('員工關懷', '', 'is-invalid', "");

    // 驗證表單 是否為空
    validateForm();
});


// 監聽提交按鈕
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

// about的產業類別選單
document.addEventListener('DOMContentLoaded', function () {
    // 統計infoCount
    let infoCount = 0;
    const question_area = document.getElementById('question');
    const about_area = document.getElementById('about');
    const about_next = document.getElementById('about_next');
    const contact = document.getElementById('contact');

    const formFields = document.getElementById('form-fields');
    const addGroupButton = document.querySelector('.add-group');
    const industryForm = document.getElementById('industry-form');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    function createFormGroup(title = '', placeholder = '') {
        infoCount++;
        const group = document.createElement('div');
        group.className = 'form-group mb-3';
        group.innerHTML = `
            <div class="form-floating mb-3">
                <input class="form-control" id="title${Date.now()}" type="text" placeholder="Enter title..." value="${title}" required data-bs-toggle="popover" data-bs-trigger="manual" data-bs-placement="left" data-bs-content="${placeholder}" />
                <label for="title${Date.now()}">標題</label>
            </div>
            <div class="form-floating mb-3">
                <textarea class="form-control" id="content${Date.now()}" placeholder="Enter content..." style="height: 10rem" required data-bs-toggle="popover" data-bs-trigger="manual" data-bs-placement="left" data-bs-content="${placeholder}"></textarea>
                <label for="content${Date.now()}">內容</label>
            </div>
            <div class="mb-3">
                <button type="button" class="btn btn-primary btn-sm add-chart">新增圖表</button>
            </div>
            <div class="chart-container" style="display: none;">
                <div class="row g-2">
                    <div class="col-md-6 d-flex flex-column justify-content-center" style="background-color: white;">
                        <div>123</div>
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
            </div>
            <button type="button" class="btn btn-danger btn-sm mt-3 delete-group">刪除</button>
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

        // 添加新增图表按钮的事件监听器
        group.querySelector('.add-chart').addEventListener('click', function () {
            const chartContainer = group.querySelector('.chart-container');
            chartContainer.style.display = 'block';
            this.style.display = 'none';
        });

        // 添加移除图表按钮的事件监听器
        group.querySelector('.remove-chart').addEventListener('click', function () {
            const chartContainer = group.querySelector('.chart-container');
            chartContainer.style.display = 'none';
            group.querySelector('.add-chart').style.display = 'inline-block';
        });

        // 添加测试按钮的事件监听器
        group.querySelector('.test-chart').addEventListener('click', function () {
            // 这里添加测试逻辑
            alert('测试功能尚未实现');
        });

        // 添加图片预览和文字预览功能
        const chartDescription = group.querySelector('.chart-description');
        const chartUpload = group.querySelector('.chart-upload');
        const chartPreview = group.querySelector('.chart-preview');
        const chartPreviewText = group.querySelector('.chart-preview-text');

        chartDescription.addEventListener('input', function () {
            chartPreviewText.textContent = this.value;
        });

        chartPreview.addEventListener('click', function () {
            chartUpload.click();
        });

        chartUpload.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    chartPreview.src = e.target.result;
                }
                reader.readAsDataURL(file);
            } else {
                // 如果用户取消选择，恢复默认图片
                chartPreview.src = '/static/images/picture_file.png';
            }
        });

        group.querySelector('.delete-group').addEventListener('click', function () {
            formFields.removeChild(group);
        });
    }

    function clearFormFields() {
        formFields.innerHTML = '';
    }

    function showIndustryForm() {
        industryForm.style.display = 'block';
    }

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

            const industry = this.id.split('-')[1];
            if (industry === 'finance') {
                createFormGroup('公司名稱', "填寫您的公司名稱，例如：「臺灣產物保險股份有限公司」或「國泰金控」。");

            }
            else if (industry === 'education') {
                createFormGroup('學校名稱', "填寫您的學校名稱，例如：「國立臺中科技大學」或「國立臺灣大學」。");
                createFormGroup('課程', "");
            }
            else {
                createFormGroup();
            }

            // 初始化所有 Popover
            const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
            popoverTriggerList.map(function (popoverTriggerEl) {
                return new bootstrap.Popover(popoverTriggerEl);
            });
        });
    });

    addGroupButton.addEventListener('click', () => createFormGroup());
});