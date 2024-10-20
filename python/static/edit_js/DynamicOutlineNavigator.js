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
    bindTocItemEvents();

    // 监听输入框变化
    const inputFields = document.querySelectorAll('.form-group [id^="name"]');
    inputFields.forEach(input => {
        input.addEventListener('input', () => {
            updateNavigationBar();
            bindTocItemEvents();
        });
    });
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
    ${sectionIds.map((id, index) => `<li><a class="toc-item" data-section="${id}">${sectionValues[index]}</a></li>`).join('')}
    `;
    // href="#${id}"
}

function bindTocItemEvents() {
    const tocItems = document.querySelectorAll('.toc-item');
    const sections = document.querySelectorAll('.form-group [id^="name"], #about');

    tocItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-section');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // 修改 Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                tocItems.forEach(item => {
                    if (item.getAttribute('data-section') === sectionId) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "-10% 0px -70% 0px"
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // 修改滚动事件监听器
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        let activeSection = null;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight - 100) {
                activeSection = section;
            }
        });

        if (activeSection) {
            tocItems.forEach(item => {
                if (item.getAttribute('data-section') === activeSection.id) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    });
}
