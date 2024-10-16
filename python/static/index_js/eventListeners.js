// 所有事件監聽器的設置

// 全域變數 有關 formHandling.js
let groupCount = 0;
let formGroups;
let my_submitButton;

// 全域變數 用來判斷info組數 有關顏色
let infoCount = 0;
const question_area = document.getElementById('question');
const about_area = document.getElementById('about');
const about_next = document.getElementById('about_next');
const contact = document.getElementById('contact');

const formFields = document.getElementById('form-fields');
const addGroupButton = document.getElementById('addGroup');
const industryForm = document.getElementById('industry-form');
const dropdownItems = document.querySelectorAll('.dropdown-item');

// 按下圖表生成器的區域
let return_chartButtons = null;

// 用於判斷是否在載入資料
let isInitialLoad = true;


// 確保在 DOM 加載完成後初始化所有事件監聽器
document.addEventListener('DOMContentLoaded', () => {
    // 初始化表單處理 有關formHandling.js
    initializeFormHandling();

    // 驗證表單 是否為空
    validateForm();

    // 初始化表單
    initializeForm();
});


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
    groupsData.forEach((groupData) => {
        const group = createFormGroup(groupData.title, groupData.content);

        // 恢復圖表數據
        if (groupData.charts && groupData.charts.length > 0) {
            const chartsContainer = group.querySelector('.charts-container');
            groupData.charts.forEach(chartData => {
                const chartContainer = createChartContainer();
                const chartPreview = chartContainer.querySelector('.chart-preview');
                const chartTitle = chartContainer.querySelector('.chart-title');
                const chartDescription = chartContainer.querySelector('.chart-description');
                const chartPreviewTitle = chartContainer.querySelector('.chart-preview-title');
                const chartPreviewText = chartContainer.querySelector('.chart-preview-text');

                chartPreview.src = chartData.base64;
                chartTitle.value = chartData.imageTitle;
                chartDescription.value = chartData.imageDescription;

                updateChartPreviewTitle(chartTitle, chartPreviewTitle);
                updateChartPreviewText(chartDescription, chartPreviewText);

                // 將新創建的圖表容器添加到圖表容器區域
                // 這行代碼將新建的圖表容器（chartContainer）添加為chartsContainer的子元素
                // 這樣做可以在用戶界面上顯示新的圖表
                chartsContainer.appendChild(chartContainer);
            });
        }
    });

    // 恢復章節數據
    if (savedChaptersData) {
        const chaptersData = JSON.parse(savedChaptersData);
        console.log("恢復章節數據", chaptersData);

        chaptersData.forEach((chapterData) => {
            // 這樣可以正常獲取到base64
            // console.log("base64", chapterData.charts[0].base64);
            const group = createGroup(chapterData.title, chapterData.prompt);

            // 恢復圖表數據
            if (chapterData.charts.length > 0) {
                const chartsContainer = group.querySelector('.charts-container');
                chapterData.charts.forEach(chartData => {
                    const chartContainer = createChartContainer();
                    const chartPreview = chartContainer.querySelector('.chart-preview');
                    const chartTitle = chartContainer.querySelector('.chart-title');
                    const chartDescription = chartContainer.querySelector('.chart-description');
                    const chartPreviewTitle = chartContainer.querySelector('.chart-preview-title');
                    const chartPreviewText = chartContainer.querySelector('.chart-preview-text');

                    chartPreview.src = chartData.base64;
                    chartTitle.value = chartData.imageTitle;
                    chartDescription.value = chartData.imageDescription;

                    updateChartPreviewTitle(chartTitle, chartPreviewTitle);
                    updateChartPreviewText(chartDescription, chartPreviewText);

                    // 將新創建的圖表容器添加到圖表容器區域 一定要加
                    chartsContainer.appendChild(chartContainer);
                });

            }
            else {
                console.log("沒有圖表數據");
            }
        });
    }

    isInitialLoad = false; // 恢復數據完成後重置標誌
}





// 創建圖表容器
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

// 清除表單字段 選擇不同的行業會清除表單字段
function clearFormFields() {
    formFields.innerHTML = '';
}

// 清除章節字段 選擇不同的行業會清除章節字段
function clearChapterFields() {
    document.getElementById('form-groups').innerHTML = '';
}

// 顯示行業表單
function showIndustryForm() {
    industryForm.style.display = 'block';
}



// 設置行業類別的點擊事件
dropdownItems.forEach(item => {
    item.addEventListener('click', function (event) {
        event.preventDefault();
        // 清除表單字段和章節字段
        clearFormFields();
        clearChapterFields();
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
                // 關於本報告書
                // createFormGroup('報告期間');
                // createFormGroup('報告書範疇');
                // createFormGroup('報告書撰寫原則');
                // createFormGroup('報告書查證與確信');
                // 長官的話
                createFormGroup('公司名稱');
                createFormGroup('公司歷史與成就');
                createFormGroup('經營成果與財務績效');
                createFormGroup('永續發展策略與目標');
                createFormGroup('氣候變遷與環境承諾');
                createFormGroup('數位轉型與創新');
                createFormGroup('社會責任與公益');
                createFormGroup('未來展望');
                // 永續績效
                createFormGroup('環境');
                createFormGroup('社會');
                createFormGroup('治理');
                createFormGroup('榮耀與肯定');
                // 關於本公司：產業類別 總部位置 成立日期 資本額 實收資本額 資產總額 員工人數 股票代號 業務範圍 經營據點
                createFormGroup('產業類別');
                createFormGroup('總部位置');
                createFormGroup('成立日期');
                createFormGroup('資本額');
                createFormGroup('實收資本額');
                createFormGroup('資產總額');
                createFormGroup('員工人數');
                createFormGroup('股票代號');
                createFormGroup('業務範圍');
                createFormGroup('經營據點');
                // 經營績效
                createFormGroup('營運績效');
                createFormGroup('財務績效');
                // 稅務管理
                createFormGroup('稅務治理政策');
                createFormGroup('所得稅資訊');
                createFormGroup('國別稅務資訊');
                // 永續發展策略
                createFormGroup('永續發展委員會');
                createFormGroup('永續策略主軸');
                createFormGroup('永續目標');
                createFormGroup('重大主題鑑別流程');
                createFormGroup('重大主題衝擊評估');
                createFormGroup('利害關係人鑑別');
                createFormGroup('利害關係人議和');


                // 建立章節
                createGroup('關於本報告書', "使用預設");
                createGroup('長官的話', "使用預設");
                createGroup('永續績效', "使用預設");
                createGroup('關於本公司', "使用預設");
                createGroup('經營績效', "使用預設");
                createGroup('稅務管理', "使用預設");
                createGroup('永續發展策略', "使用預設");

                // createGroup('永續發展策略', "");
                // createGroup('公司治理', "");
                // createGroup('永續金融', "");
                // createGroup('永續環境', "");
                // createGroup('員工關懷', "");
            }
            else if (industry === 'education') {
                createFormGroup('學校名稱');
                createFormGroup('課程');
                // 建立章節
                createGroup('關於本報告書', "");

            }
            else {
                createFormGroup();
            }
        }

        // 初始化所有 Popover XXXX啊啊啊 找到問題了...
        // const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        // popoverTriggerList.map(function (popoverTriggerEl) {
        //     return new bootstrap.Popover(popoverTriggerEl);
        // });

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

// 清除本地存儲的按鈕
const clearStorageButton = document.createElement('button');
clearStorageButton.textContent = '清除保存的數據';
clearStorageButton.addEventListener('click', () => {
    localStorage.removeItem('groupsData');
    localStorage.removeItem('chaptersData');
    localStorage.removeItem('selectedIndustry');
    localStorage.removeItem('chart-image');
    location.reload();
});
document.body.appendChild(clearStorageButton);


// 僅用於測試
// 加入"載入預設資料"的按鈕
const loadDefaultDataButton = document.createElement('button');
loadDefaultDataButton.textContent = '載入預設資料';
document.body.appendChild(loadDefaultDataButton);

loadDefaultDataButton.addEventListener('click', () => {
    // 預設資料
    const defaultData = {
        // 資訊
        // 關於本報告書
        '公司名稱': '綠色金控',
        '報告期間': '2024年',
        '報告書範疇': '本報告書涵蓋的範疇包括 綠色金融控股公司及其全資子公司（綠色銀行、綠色證券、綠色人壽、綠色 投信、綠色 投顧）之企業永續發展實踐與成果。報告書中提到的「綠色金控」、或「本公司」皆指包含以上所有營運個體之整體。',
        '報告書撰寫原則': '依據GRI，SASB，TCFD',
        '聯絡資訊': 'Green Financial Holding Co., Ltd. 地址：106台北市大安區敦化南路一段233號10樓 電話：(02)2709-2888 傳真：(02)2709-2899 信箱：green@greenfinancial.com.tw 網站：www.greenfinancial.com.tw',

        // 董事長的話
        '公司歷史與成就': '綠色金控自成立以來已有30餘年歷史，憑藉穩健的經營策略，逐步成為業界的領導者。我們成功地在國內外市場取得優異的成績，並持續擴展業務版圖，在永續金融領域有顯著影響力的台灣金融控股公司，為台灣唯一加入世界經濟論壇 (WEF) 的金融業會員，致力於推動永續發展及實踐 ESG 承諾。',
        '環境': '我們在2023年成功降低了公司總碳排放量15%，並達成了年度能源使用效率提升的目標，將50%的電力來源轉換為再生能源。此外，我們積極推動廢棄物管理，回收再利用率達到85%，為公司永續發展奠定了環保基礎。',
        '社會': '公司持續關注員工的福祉與職業發展，2023年內部培訓時數達到人均40小時，並實施了多項職場健康計畫。同時，我們積極參與社會 公益活動，捐助了超過500萬元，支持弱勢族群教育與環保項目，促進社會和諧。',
        '治理': '2023年，我們加強了公司治理結構，確保業務運作的透明度與責任感。董事會成員中40%為獨立董事，並在決策過程中積極考慮ESG相關議題。我們強化了風險管理與合規機制，實施了多項內部審計。',
        '榮耀與肯定': '2023年，我們在多個領域獲得了肯定，包括最佳永續金融獎、最佳企業社會責任獎等。這些榮譽不僅肯定了我們的成就，也激勵我們繼續努力，實現更高的永續發展目標。',

        // 關於本報告書
        '產業類別': '金融服務',
        '總部位置': '臺中市北區',
        '成立日期': '2005年5月15日',
        '資本額': '新臺幣 300 億元',
        '實收資本額': '新臺幣 280 億元',
        '資產總額': '新臺幣 5,000 億元',
        '員工人數': '2,500 人',
        '股票代號': '1234',
        '業務範圍': '綠色銀行 : 存款業務、個人貸款、外匯與匯兌服務\n綠色證券 : 股票、債券、基金等有價證券買賣\n綠色投信 : 基金管理、退休金與年金管理\n綠色人壽 : 壽險產品、健康保險、重大疾病保險、意外險\n綠色資產管理 : 壞帳管理與催收、不良資產處理與收購、資產評估與處置\n綠色創投 : 新創企業投資與輔導、產業投資策略諮詢、技術創新與研發資金支持',
        '經營據點': '臺北市：5 個據點\n新北市：3 個據點\n桃園市：2 個據點\n臺中市：4 個據點\n彰化縣：1 個據點\n雲林縣：1 個據點\n臺南市：2 個據點\n高雄市：3 個據點\n宜蘭縣：1 個據點\n香港：2 個據點\n新加坡：1 個據點\n上海：2 個據點\n東京：1 個據點',

        // 經營績效 : 營運績效 財務績效
        '營運績效': '在2023年，本公司在穩健的市場基礎上持續追求卓越成長，合併稅後淨利達到17.878億元，稅後每股盈餘為1.01元，股東權益報酬率達8.25%。公司在面對高通膨和利率波動的挑戰中，依然展現出良好的財務穩健性，年底總資產達到4,803.703億元，相較於去年增長4.5%。其中，核心業務表現強勁，尤其是銀行部門的稅後淨利達到16億元，增長率為15%。\n\n在經紀業務方面，本公司在市場上的表現突出，現貨市佔率達到8.2%，名列市場第四。財富管理業務亦顯示出強勁的增長，海外股票交易金額年增24%，達到450億元，結構型商品交易金額也提升了33%，達到180億元，顯示出我們在高端金融產品上的競爭力。\n\n展望未來，2024年本公司將繼續優化資本運用，增強業務策略，並聚焦於數位轉型與創新。我們計畫進一步加強在綠色金融及ESG相關業務的投入，以支持可持續發展的經營模式，期望在全球市場上拓展更大的份額，並持續提升整體獲利能力。',
        '財務績效': '資產總額（百萬元） 2021年 : 4,433,836；2022年 : 4,476,168；2023年 : 4,803,703\n負債總額（百萬元） 2021年 : 4,190,958；2022年 : 4,255,405；2023年 : 4,557,924\n股東權益總計（仟元） 2021年 : 198,101,328；2022年 : 202,893,812；2023年 : 216,562,473\n稅後淨利（百萬元） 2021年 : 21,212；2022年 : 20,817；2023年 : 17,878\n資產報酬率（%，稅後） 2021年 : 0.49；2022年 : 0.47；2023年 : 0.39\n純益率（%） 2021年 : 38.98；2022年 : 39.14；2023年 : 29.13\n每股盈餘（元） 2021年 : 1.49；2022年 : 1.04；2023年 : 1.01\n員工平均收益額（千元） 2021年 : 5,668；2022年 : 5,475；2023年 : 6,279\n員工平均獲利額（千元） 2021年 : 2,210；2022年 : 2,143；2023年 : 1,829\n員工福利費用（千元） 2021年 : 18,236,308；2022年 : 17,541,280；2023年 : 17,292,237',

        // 稅務管理 : 公司名稱 稅務治理政策 所得稅資訊 國別稅務資訊
        '稅務治理政策': '本公司遵循誠信穩健的經營理念，制定《稅務治理政策》，確保稅務管理機制有效運作，並支持永續發展。政策重點如下：\n\n法令遵循：遵守各營運地區的稅法，依國際準則準確及時地申報、繳納稅款，善盡納稅義務，展現社會責任。\n風險控管：建立稅務風險控管機制，評估經營活動的稅務風險，確保稅務管理符合永續目標。\n經濟實質：不從事無商業實質的稅務規劃，遵守移轉訂價規則，不利用租稅天堂避稅。\n資訊透明：每年公開各國納稅狀況及稅務風險，確保利害關係人了解稅務政策及實踐。\n誠信溝通：與各地稅務機關保持開放對話，分享專業見解，促進互信合作。\n人才培育：強化內部稅務團隊能力，定期進行稅務專業訓練，提升風險控管及法規遵循知識。',
        '所得稅資訊': '稅前淨利 : 2022 年 : 14,300,000 ; 2023 年 : 10,500,000 ; 平均數 : 12,400,000\n所得稅費用 : 2022 年 : 2,600,000 ; 2023 年 : 1,250,000 ; 平均數 : 1,925,000\n有效稅率（％） : 2022 年 : 18.18% ; 2023 年 : 11.90% ; 平均數 : 15.04%\n支付所得稅 : 2022 年 : 780,000 ; 2023 年 : 500,000 ; 平均數 : 640,000\n現金稅率（％） : 2022 年 : 5.45% ; 2023 年 : 4.76% ; 平均數 : 5.10% \n(單位 : 新臺幣千元)',
        '國別稅務資訊': '臺灣 : 營業收入 : 395,620,548 ; 稅前淨利 : 24,875,324 ; 當期所得稅 : 3,956,842 ; 已繳納所得稅 : 1,105,630 ; 員工人數 : 8,130\n中國 : 營業收入 : 1,278,945 ; 稅前淨利 : 525,800 ; 當期所得稅 : 65,300 ; 已繳納所得稅 : 29,500 ; 員工人數 : 98\n香港 : 營業收入 : 3,020,123 ; 稅前淨利 : 1,020,456 ; 當期所得稅 : 160,780 ; 已繳納所得稅 : 75,200 ; 員工人數 : 42\n美國 : 營業收入 : 2,850,678 ; 稅前淨利 : 430,000 ; 當期所得稅 : 105,000 ; 已繳納所得稅 : 13,500 ; 員工人數 : 41\n日本 : 營業收入 : 1,200,678 ; 稅前淨利 : 140,000 ; 當期所得稅 : 67,800 ; 已繳納所得稅 : 33,200 ; 員工人數 : 20\n合計 : 營業收入 : 403,970,972 ; 稅前淨利 : 26,991,580 ; 當期所得稅 : 4,355,722 ; 已繳納所得稅 : 1,257,030 ; 員工人數 : 8,331\n(單位 : 新臺幣千元 / 人)',

        // 永續發展策略
        '永續發展委員會': '',
        '永續策略主軸': '',
        '永續目標': '',
        '重大主題鑑別流程': '',
        '重大主題衝擊評估': '',
        '利害關係人鑑別': '',
        '利害關係人議和': '',

        // '經營成果與財務績效': '過去一年，我們的營收達到新高，實現了30億元的收入，淨利潤也比去年增長了148%。',
        // '永續發展策略與目標': '我們始終致力於推動永續發展，並將此理念融入公司的長期策略。未來五年，我們將持續降低碳排放，並將50%的能源轉換為再生能源，以達到我們的永續目標。',
        // '氣候變遷與環境承諾': '在應對氣候變遷方面，我們承諾在2030年實現碳中和，並持續投資於綠色科技與低碳創新，為環境保護盡一份心力。',
        // '數位轉型與創新': '為了保持競爭優勢，我們積極推動數位轉型，並引入人工智慧與大數據技術來提升營運效率，這不僅改善了我們的服務品質，也開拓了新的市場機會。',
        // '社會責任與公益': '我們深知企業對社會的責任，因此在過去一年中，投入了超過88萬元於公益計畫，並支持了各類教育與環保項目，促進社會的正向發展。',
        // '未來展望': '展望未來，我們將繼續朝著永續與創新的方向前進，持續強化公司的核心競爭力，並積極應對全球變遷帶來的挑戰，與各界攜手共創更美好的未來。',
        // 章節
        // '關於本報告書': '本報告書涵蓋中科金控2024年度的永續發展成果。',
        // '長官的話': '',
        // '關於公司': '中科金控是一家領先的金融服務提供商，專注於創新和可持續發展。',
        // '永續發展策略': '我們的策略基於三大支柱：金融創新、環境責任和社會影響。',
        // '公司治理': '我們堅持最高標準的公司治理，確保透明度和問責制。',
        // '永續金融': '我們開發和提供多種永續金融產品，支持綠色經濟轉型。',
        // '永續環境': '我們致力於減少自身營運的環境足跡，並支持客戶的環保計劃。',
        // '員工關懷': '我們為員工提供全面的培訓、福利和職業發展機會。'
    };

    // 填充表單字段
    const formGroups = document.querySelectorAll('#form-fields .form-group');
    formGroups.forEach((group, index) => {
        const input = group.querySelector('input[type="text"]');
        const textarea = group.querySelector('textarea');
        const deleteGroup = group.querySelector('.delete-group');

        if (input && textarea) {
            // 根據索引從defaultData對象中獲取對應的鍵名
            const key = Object.keys(defaultData)[index];
            if (key === undefined) {
                deleteGroup.click();
            }
            input.value = key;
            textarea.value = defaultData[key];
        }
    });

    // 填充章節內容
    const chapterGroups = document.querySelectorAll('#form-groups .form-group');
    chapterGroups.forEach((group) => {
        const input = group.querySelector('input[type="text"]');
        const textarea = group.querySelector('textarea');
        if (input && textarea && defaultData[input.value]) {
            textarea.value = defaultData[input.value];
        }
    });

    // 自動保存
    autoSave();
});

