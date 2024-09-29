function loadSavedDataOnPageLoad(response_data) {
    // 資訊
    if (response_data && response_data.data && response_data.data.資訊) {
        const infoData = response_data.data.資訊;
        for (const [key, value] of Object.entries(infoData)) {
            createFormGroup(key, value);
        }
    } else {
        console.error('無法找到資訊數據或數據格式不正確');
    }
    // 紀錄存history_records的狀態 false == 還沒存過
    let is_history_records = false;

    // 重整不會再存歷史紀錄
    if (localStorage.getItem('historical_records')) {
        is_history_records = true;
    }

    // 章節
    if (response_data && response_data.data && response_data.data.章節) {
        const chapterData = response_data.data.章節;
        for (const [key, value] of Object.entries(chapterData)) {
            const group = createGroup(value.title, value.prompt, value.generatedResult);
            // 首次存檔僅一次 歷史紀錄
            // 如果 localStorage.getItem('historical_records') 不存在，則存入，代表使用者第一次進入edit
            // 避免重整時，重複存檔
            if (!is_history_records) {
                append_historical_records(value.title, value.prompt, value.generatedResult);
            }

            // 恢復圖表數據
            if (value.charts.length > 0) {
                const chartsContainer = group.querySelector('.charts-container');
                value.charts.forEach(chartData => {
                    const chartContainer = createChartContainer();
                    const chartPreview = chartContainer.querySelector('.chart-preview');
                    const chartTitle = chartContainer.querySelector('.chart-title');
                    const chartDescription = chartContainer.querySelector('.chart-description');
                    const chartPreviewTitle = chartContainer.querySelector('.chart-preview-title');
                    const chartPreviewText = chartContainer.querySelector('.chart-preview-text');

                    chartPreview.src = chartData.base64;
                    chartTitle.value = chartData.imageTitle;
                    chartDescription.value = chartData.imageDescription;

                    // 直接更新預覽標題和文本
                    chartPreviewTitle.textContent = chartData.imageTitle;
                    chartPreviewText.textContent = chartData.imageDescription;

                    chartsContainer.appendChild(chartContainer);
                });
            }
        }
        // 存過歷史紀錄 這樣重整不會再存
        is_history_records = true;

    } else {
        console.error('無法找到章節數據或數據格式不正確');
    }

    // 用於判斷是否在載入資料
    isInitialLoad = false; //載入資料完成
    autoSave();
}


// 恢復圖表
function createChartContainer() {
    console.log('創建新的圖表容器');  // 添加日誌
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container mb-3';
    chartContainer.innerHTML = `
        <div class="row g-2">
            <div class="col-md-6 d-flex flex-column justify-content-center" style="background-color: white;">
                <div class="mb-3">設定圖表</div>
                <div class="form-floating mb-3">
                    <input type="text" class="form-control chart-title" placeholder="Enter chart title...">
                    <label>圖表標題</label>
                </div>
                <div class="form-floating mb-3">
                    <textarea class="form-control chart-description" placeholder="Enter chart description..." style="height: 5rem"></textarea>
                    <label>圖表描述</label>
                </div>
                <div class="mb-3">
                    <button type="button" id='' class="btn btn-secondary btn-sm test-chart me-1" data-bs-toggle="modal" data-bs-target="#csvPieChartModal">使用圖表生成器</button>
                    <button type="button" class="btn btn-danger btn-sm remove-chart">移除圖表</button>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card h-100">
                    <img src="../static/index_js/image/picture_file.png" class="card-img-top chart-preview" alt="圖表預覽" style="cursor: pointer; width: 100%; height: 300px; object-fit: contain;">
                    <div class="card-body" style="padding-top: 5px;">
                        <h5 class="card-title chart-preview-title mb-1" style="text-align: center;"></h5>
                        <p class="card-text chart-preview-text mb-0" style="text-align: center;"></p>
                    </div>
                </div>
                <input class="form-control chart-upload mt-2" type="file" accept="image/*" style="display: none;">
            </div>
        </div>
    `;

    const chartTitle = chartContainer.querySelector('.chart-title');
    const chartDescription = chartContainer.querySelector('.chart-description');
    const chartPreviewTitle = chartContainer.querySelector('.chart-preview-title');
    const chartPreviewText = chartContainer.querySelector('.chart-preview-text');

    chartTitle.addEventListener('input', function () {
        updateChartPreviewTitle(this, chartPreviewTitle);
    });

    chartDescription.addEventListener('input', function () {
        updateChartPreviewText(this, chartPreviewText);
    });

    updateChartPreviewTitle(chartTitle, chartPreviewTitle);
    updateChartPreviewText(chartDescription, chartPreviewText);

    // 添加移除圖表按鈕的事件監聽器
    chartContainer.querySelector('.remove-chart').addEventListener('click', function () {
        console.log('移除圖表按鈕被點擊');  // 添加日誌
        chartContainer.remove();
        autoSave(); // 在移除圖表后自動保存
        console.log("移除圖表呼叫自動保存", isInitialLoad);
    });

    // 添加圖片點擊和文件上傳事件
    const chartPreview = chartContainer.querySelector('.chart-preview');
    const chartUpload = chartContainer.querySelector('.chart-upload');

    // 如果需要在其他地方使用這個按鈕，可以考慮將它添加到某個對象或數組中
    return_chartButtons = chartPreview;

    // 當按下圖表生成器按鈕時，將<input class="form-control chart-upload mt-2" type="file" accept="image/*" style="display: none;">紀錄在localStorage
    const testChartButton = chartContainer.querySelector('.test-chart');
    testChartButton.addEventListener('click', function () {
        return_chartButtons = chartPreview;
    });

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

    chartTitle.addEventListener('blur', autoSave);
    chartDescription.addEventListener('blur', autoSave);

    return chartContainer;
}

// 新增一個輔助函數來更新預覽標題
function updateChartPreviewTitle(titleElement, previewElement) {
    previewElement.textContent = titleElement.value;
    autoSave();
    console.log("更新圖表標題呼叫自動保存", isInitialLoad);
}

// 新增一個輔助函數來更新預覽文本
function updateChartPreviewText(descriptionElement, previewElement) {
    previewElement.textContent = descriptionElement.value;
    autoSave();
    console.log("更新圖表描述呼叫自動保存", isInitialLoad);
}