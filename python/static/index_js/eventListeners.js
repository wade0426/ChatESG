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
            <button type="button" class="btn btn-danger btn-sm mb-3 delete-group">刪除</button>
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
                createFormGroup('成立時間', "填寫您的公司成立時間，例如：「1990年」。");
                createFormGroup('報告年度', "填寫您的公司報告年度，例如：「2024年」。");
                createFormGroup('公司簡介', "提供公司的簡要介紹，包括核心業務領域。例如：「臺灣產物保險股份有限公司是全台歷史最悠久的產物保險公司，致力於提供客戶多元且創新的保險產品及服務。」");
                createFormGroup('董事會與管理層', "提供董事會成員和管理層的簡介，包括他們的背景和在公司的角色。例如：「本公司董事會由七名資深董事組成，皆具有豐富的金融業經驗，並由總經理領導管理團隊。」");
                createFormGroup('公司願景與使命', "描述公司長遠的發展願景以及現階段的使命。例如：以『穩健經營、客戶導向』為核心策略，致力於成為亞太地區最具影響力的金融機構。");
                createFormGroup('核心價值觀', "列出公司堅持的核心價值觀，這些價值觀如何指導公司的決策和行為。例如：「誠信、創新、客戶至上、永續發展。」");
                createFormGroup('產品與服務', "描述公司提供的主要產品和服務，包括市場定位和特色。例如：「臺灣產物保險提供車險、住宅保險、企業財產保險等多元產品，並致力於創新發展綠能保險。」");
                createFormGroup('市場地位', "提供公司在市場中的地位和競爭優勢，如市場份額或領先優勢。例如：「本公司在台灣產險市場的市占率達到20%，位居市場前列。」");
                createFormGroup('營運績效', "概述公司的財務和非財務績效，重點包括主要的財務指標，如收入、利潤、資產負債比等。例如：「2022年資本額為36.22億元，風險資本適足率達1081.89%」。");
                createFormGroup('稅務管理', "說明公司在稅務遵循和稅務透明度方面的做法，包括如何確保適當的稅務策略和合規。");
                createFormGroup('關鍵成就與獎項', "列出公司在報告年度內的關鍵成就和獲得的獎項，例如：「榮獲金管會2022年度公平待客評核結果為產險業排名前25%之績優金融機構」。");
                createFormGroup('永續發展委員會設立', "永續經營委員會設立 本行於董事會下設置「永續經營委員會」");
                createFormGroup('永續發展委員會成員', '永續經營委員會成員 由董事長擔任召集人，加上三位獨立董事及總經理組成')
                createFormGroup('永續發展委員會職責', '負責推動永續發展價值納入經營政策、協調建立相關制度、督導檢視政策之執行情形及其成效，定期審核相關執行報告')
                createFormGroup('永續發展政策和守則', '本司承諾持續呼應 SDGs 永續發展政策，並訂定5大政策議題「公司治理」、「責任金融」、「員工照護」、「社會共融」及「環境永續」，以兼顧企業業務成長、利害關係人權益，以及環境與社會的永續發展。')
                createFormGroup('永續發展措施', "填寫公司在環境保護、社會參與及公司治理等方面的具體措施，例如：「推動數位E化作業及車險保單無紙化」。例如：「公司制定綠色低碳運營模式，推動能資源耗損的減少及高耗能設備的汰換。」");
                createFormGroup('社會責任行動', "填寫公司在社會責任方面的具體行動如慈善活動、社區關懷或其他公益舉措，例如：「成立臺灣產物保險文教基金會，支持青少年校園反毒宣導」。例如：「臺灣產物保險文教基金會多年來積極關懷弱勢群體，推動婦女與獨居老人的照顧計畫。」");
                createFormGroup('永續經營理念', "本司致力於推動永續經營理念，致力於實踐企業社會責任，秉持著環保、社會責任與公司治理三大核心價值，將其融入到日常經營活動中，確保企業長期穩健發展，為環境保護和社會進步貢獻力量。");
                createFormGroup('減碳成效', "本司積極響應國際減碳趨勢，於 2022 年取得 ISO14064-1 溫室氣體排放量盤查證書，並完成所有國內、海外據點及子公司的盤查，展現我們邁向淨零排放的決心。同時，我們積極推動綠色金融，將 ESG 因素納入授信評估，引導資金投入永續發展領域，積極推動低碳轉型。");
                createFormGroup('未來承諾', "填寫公司未來的計劃和面臨的挑戰，例如：「面對氣候變遷及資安威脅，將加速跨界交流與加深協作能力」。");
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