// 定義上移函數
function moveChapterUp(group) {
    const formGroups = document.getElementById('form-groups');
    const previousGroup = group.previousElementSibling;
    if (previousGroup) {
        formGroups.insertBefore(group, previousGroup);
        updateChapterOrder();
        autoSave();
    }
}

// 定義下移函數
function moveChapterDown(group) {
    const formGroups = document.getElementById('form-groups');
    const nextGroup = group.nextElementSibling;
    if (nextGroup) {
        formGroups.insertBefore(nextGroup, group);
        updateChapterOrder();
        autoSave();
    }
}

// 更新章節順序
function updateChapterOrder() {
    const groups = document.querySelectorAll('#form-groups .form-group');
    groups.forEach((group, index) => {
        const titleInput = group.querySelector('input[type="text"]');
        if (titleInput) {
            titleInput.id = `name${index + 1}`;
            titleInput.name = `name${index + 1}`;
        }
        const textarea = group.querySelector('textarea');
        if (textarea) {
            textarea.id = `message${index + 1}`;
            textarea.name = `message${index + 1}`;
        }
    });
}

