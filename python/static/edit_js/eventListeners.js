// 監聽 "下載成檔案" 按鈕
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
        alert('提交成功！');

        // 使用 Bootstrap 的 JavaScript API 來顯示 Modal
        var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
        myModal.show();

        generate_word();
    }
});

// 為調適目的添加這些事件監聽器
document.getElementById('wating_start-btn').addEventListener('click', function () {
    var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
    myModal.show();
});

document.getElementById('wating_cancel-btn').addEventListener('click', function () {
    var myModal = bootstrap.Modal.getInstance(document.getElementById('staticBackdrop'));
    if (myModal) {
        myModal.hide();
    }
});
