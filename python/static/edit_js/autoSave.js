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
                imageTitle: chartContainer.querySelector('.chart-title').value,
                imageDescription: chartContainer.querySelector('.chart-description').value,
                url: "" // 暫時為空
            });
        });

        groupsData.push({ title, content, charts });
    });

    // 保存 chapters 數據（章節、prompt 和圖表）
    document.getElementById('form-groups').querySelectorAll('.form-group').forEach((group) => {
        const title = group.querySelector('input[type="text"]').value;
        const content = group.querySelector('textarea').value;
        const generatedResult = group.querySelectorAll('textarea')[1].value;
        const charts = [];

        group.querySelectorAll('.chart-container').forEach(chartContainer => {
            charts.push({
                base64: chartContainer.querySelector('.chart-preview').src,
                imageTitle: chartContainer.querySelector('.chart-title').value,
                imageDescription: chartContainer.querySelector('.chart-description').value,
                url: "" // 暫時為空
            });
        });

        chaptersData.push({ title, content, charts, generatedResult });
    });

    // 保存response
    const response_data = {
        data: {
            groupCount: chaptersData.length,
            infoCount: groupsData.length,
            章節: chaptersData.reduce((acc, chapter, index) => {
                acc[`group${index + 1}`] = {
                    title: chapter.title,
                    prompt: chapter.content,
                    charts: chapter.charts,
                    generatedResult: chapter.generatedResult
                };
                return acc;
            }, {}),
            資訊: groupsData.map(info => ({
                title: info.title,
                content: info.content
            }))
        }
    };
    console.log("response_data", response_data);
    localStorage.setItem('response', JSON.stringify(response_data));

    localStorage.setItem('groupsData', JSON.stringify(groupsData));
    console.log("groupsData", groupsData);
    localStorage.setItem('chaptersData', JSON.stringify(chaptersData));
    console.log("chaptersData", chaptersData);

    // 保存選擇的行業類別
    const activeIndustry = document.querySelector('.dropdown-item.active');
    if (activeIndustry) {
        localStorage.setItem('selectedIndustry', activeIndustry.id);
    }
}