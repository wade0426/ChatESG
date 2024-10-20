// 設定導覽列的JS程式

// 設定導覽列的JS程式 開啟和關閉
document.addEventListener('DOMContentLoaded', function () {
    const chapterNav = document.getElementById('chapter-nav');
    const closeNavBtn = document.getElementById('close-nav');
    const openNavBtn = document.getElementById('open-nav');

    closeNavBtn.addEventListener('click', function () {
        chapterNav.classList.add('hidden');
        openNavBtn.classList.add('visible');
    });

    openNavBtn.addEventListener('click', function () {
        chapterNav.classList.remove('hidden');
        openNavBtn.classList.remove('visible');
    });
    updateNavigationBar();
});


function updateNavigationBar() {
    // 抓到 const sections = document.querySelectorAll('.form-group [id^="name"]') 裡面的所有 value;
    const sections = document.querySelectorAll('.form-group [id^="name"]');
    const sectionValues = [];
    const sectionIds = [];
    sections.forEach(section => {
        sectionValues.push(section.value);
        sectionIds.push(section.id);
    });
    // console.log(sectionValues);
    // id="toc-list"
    const tocList = document.getElementById('toc-list');
    tocList.innerHTML = `
    <li><a href="#about" class="toc-item" data-section="about">您的資訊</a></li>
    <h3>章節大綱</h3>
    ${sectionIds.map((id, index) => `<li><a href="#${id}" class="toc-item" data-section="${id}">${sectionValues[index]}</a></li>`).join('')}
    `;
}


// 導覽列的JS程式

// 導覽列
const tocItems = document.querySelectorAll('.toc-item');
// 輸入框
const sections = document.querySelectorAll('.form-group [id^="name"]');

tocItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-section');
        document.getElementById(targetId).scrollIntoView({ behavior: "smooth" });
    });
});

// 修改 Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const sectionId = entry.target.id;
        const correspondingTocItem = document.querySelector(`.toc-item[data-section="${sectionId}"]`);

        if (entry.isIntersecting) {
            tocItems.forEach(item => item.classList.remove('active'));
            correspondingTocItem.classList.add('active');
        } else {
            correspondingTocItem.classList.remove('active');
        }
    });
}, {
    // 降低閥值，使其更容易觸發
    threshold: 0.1,
    // 調整觀察區域，使其更接近頁面頂部
    rootMargin: "-10% 0px -50% 0px"
});

sections.forEach(section => {
    observer.observe(section);
});

// 添加滾動事件監聽器，以確保始終有一個活動項
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    let activeSection = sections[0];

    sections.forEach(section => {
        if (section.offsetTop <= scrollPosition + 100) {
            activeSection = section;
        }
    });

    tocItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === activeSection.id) {
            item.classList.add('active');
        }
    });
});
