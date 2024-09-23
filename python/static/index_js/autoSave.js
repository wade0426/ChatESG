// 修改 autoSave 函数
function autoSave() {
    if (isInitialLoad) return; // 如果是初始加载，不执行自动保存

    const groupsData = [];
    const chaptersData = [];

    // 保存 groups 數據（標題、內容和圖表）
    document.getElementById('form-fields').querySelectorAll('.form-group').forEach((group) => {
        const title = group.querySelector('input[type="text"]').value;
        const content = group.querySelector('textarea').value;
        const charts = [];

        group.querySelectorAll('.chart-container').forEach(chartContainer => {
            charts.push({
                base64: chartContainer.querySelector('.chart-preview').src,
                imageDescription: chartContainer.querySelector('.chart-description').value,
                url: "" // 暫時為空
            });
        });

        groupsData.push({ title, content, charts });
    });

    // 保存 chapters 數據（章節和prompt）
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