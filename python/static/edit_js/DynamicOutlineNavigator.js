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
    sections.forEach(section => {
        sectionValues.push(section.value);
    });
    // console.log(sectionValues);
    // id="toc-list"
    const tocList = document.getElementById('toc-list');
    tocList.innerHTML = `
    <li><a href="#about" class="toc-item" data-section="about">您的資訊</a></li>
    <h3>章節大綱</h3>
    ${sectionValues.map(value => `<li><a href="#${value}" class="toc-item" data-section="${value}">${value}</a></li>`).join('')}
    `;
}






// 導覽列的JS程式


const tocItems = document.querySelectorAll('.toc-item');

console.log(sections);

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
        }
    });
}, {
    threshold: 0.1,  // 降低阈值，使其更容易触发
    rootMargin: "-10% 0px -70% 0px"  // 调整观察区域，使其更接近页面顶部
});

sections.forEach(section => {
    observer.observe(section);
});

// 添加滚动事件监听器，以确保始终有一个活动项
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