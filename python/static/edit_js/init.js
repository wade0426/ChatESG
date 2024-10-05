// 全域變數
let infoCount = 0;
let groupCount = 0;

// 用於判斷是否在載入資料
let isInitialLoad = true;

// 先讀取 localStorage.getItem('response')
let response_json = localStorage.getItem('response');
// response_json = {"data":{"groupCount":1,"infoCount":2,"章節":{"group1":{"charts":[],"generatedResult":"各位利害關係人您好，\n\n中科金控自 2005 年成立以來，始終秉持著永續經營的理念，致力於為客戶創造價值，為員工打造幸福職場，並為社會帶來正面影響。我們深信，企業的成功與否，不僅止於財務表現，更取決於在環境保護、社會責任和公司治理等方面的貢獻。\n\n本報告書具體展現中科金控在 ESG 各方面的努力與成果，我們將持續精進，邁向永續發展的目標。 \n","prompt":"請撰寫一篇企業ESG報告書中的\"長官的話\" 輸出 100字左右","title":"長官的話"}},"資訊":{"公司名稱":"中科金控","公司歷史與成就":"2005成立"}}}

if (response_json) {
    // 將 response_json 轉換為 JSON 物件
    const response_data = JSON.parse(response_json);
    console.log("init call response_data", response_data);
    // 呼叫 loadSavedDataOnPageLoad 函數
    loadSavedDataOnPageLoad(response_data);

} else {
    console.log('在localStorage中找不到response');
    // 重新導向到index.html
    alert("在localStorage中找不到response");
    window.location.href = '/';
}

// 等待DOM加載完成後，再執行以下程式碼，加入"添加新資料"的監聽器
document.addEventListener('DOMContentLoaded', function () {
    const addGroupButtons = document.getElementsByClassName('add-group');
    for (let button of addGroupButtons) {
        button.addEventListener('click', function () {
            createFormGroup();
        });
    }
});

// 等待DOM加載完成後，再執行以下程式碼，加入"添加新資料"的監聽器
document.addEventListener('DOMContentLoaded', function () {
    const addGroupButton = document.getElementById('addGroup');
    addGroupButton.addEventListener('click', function () {
        createGroup();
    });
});

// 監聽資訊顯示關閉的事件
const myCollapsible = document.getElementById('myCollapsible')
myCollapsible.addEventListener('click', function () {
    if (myCollapsible.textContent === "顯示資訊") {
        myCollapsible.textContent = "隱藏資訊";
    } else {
        myCollapsible.textContent = "顯示資訊";
    }
})
