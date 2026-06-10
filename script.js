document.addEventListener('DOMContentLoaded', () => {
    
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (header) {
                header.classList.toggle('menu-open');
            }
        });

        // リンクをクリックしたらメニューを閉じる (モバイル向け)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                if (header) {
                    header.classList.remove('menu-open');
                }
            });
        });
    }

    // ==========================================
    // 2. ヘッダーのスクロール時のスタイル変化
    // ==========================================
    const toggleHeaderBackground = () => {
        if (header) {
            if (window.scrollY > 50) {
                header.style.padding = '4px 0';
                header.style.boxShadow = '0 5px 20px rgba(54, 37, 28, 0.08)';
                header.classList.add('scrolled');
            } else {
                header.style.padding = '8px 0';
                header.style.boxShadow = 'none';
                header.classList.remove('scrolled');
            }
        }
    };

    window.addEventListener('scroll', toggleHeaderBackground);
    toggleHeaderBackground(); // 初期化時にも実行

    // ==========================================
    // 3. スクロール連動のアニメーション (Intersection Observer)
    // ==========================================
    const animElements = document.querySelectorAll('.fade-in-up, .reveal-left, .reveal-right, .reveal-up');

    if ('IntersectionObserver' in window) {
        const animObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // 一度表示されたら監視を解除する
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null, // ビューポートを基準にする
            threshold: 0.15, // 15%見えたらトリガー
            rootMargin: '0px 0px -50px 0px' // 少し早めにトリガー
        });

        animElements.forEach(el => {
            animObserver.observe(el);
        });
    } else {
        // IntersectionObserverがサポートされていないブラウザへのフォールバック
        animElements.forEach(el => {
            el.classList.add('active');
        });
    }

    // ==========================================
    // 4. アンカーリンクのスムーズスクロール
    // ==========================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return; // トップに戻る場合はデフォルト動作

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // ヘッダーの高さを考慮してスクロール位置を調整
                const headerHeight = header.offsetHeight || 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});
