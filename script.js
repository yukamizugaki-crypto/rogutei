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

    // ==========================================
    // 5. メニューポップアップモーダル & スライダー制御
    // ==========================================
    const openModalBtn = document.getElementById('openMenuModal');
    const menuModal = document.getElementById('menuModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalOverlay = menuModal ? menuModal.querySelector('.menu-modal-overlay') : null;
    
    const sliderWrapper = document.getElementById('menuSliderWrapper');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const currentSlideNum = document.getElementById('currentSlideNum');
    
    let currentSlideIndex = 0;
    const totalSlides = 6;
    
    if (openModalBtn && menuModal) {
        // モーダルを開く
        openModalBtn.addEventListener('click', () => {
            menuModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // 背面のスクロールを禁止
            currentSlideIndex = 0;
            updateSlider(false); // アニメーションなしで最初のスライドにリセット
        });
        
        // モーダルを閉じる関数
        const closeModal = () => {
            menuModal.classList.remove('active');
            document.body.style.overflow = ''; // スクロール許可を元に戻す
        };
        
        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
        
        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuModal.classList.contains('active')) {
                closeModal();
            }
        });
    }
    
    // スライダー更新関数
    const updateSlider = (animate = true) => {
        if (!sliderWrapper) return;
        
        if (animate) {
            sliderWrapper.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        } else {
            sliderWrapper.style.transition = 'none';
        }
        
        sliderWrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
        if (currentSlideNum) {
            currentSlideNum.textContent = currentSlideIndex + 1;
        }
    };
    
    // 次のスライドへ
    const nextSlide = () => {
        currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
        updateSlider();
    };
    
    // 前のスライドへ
    const prevSlide = () => {
        currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    };
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // キーボードの矢印キーでのスライド操作
    document.addEventListener('keydown', (e) => {
        if (menuModal && menuModal.classList.contains('active')) {
            if (e.key === 'ArrowRight') {
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
            }
        }
    });

    // スワイプ・ドラッグの簡易サポート（タッチデバイス向け）
    let startX = 0;
    let isSwiping = false;
    
    if (sliderWrapper) {
        sliderWrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
        }, { passive: true });
        
        sliderWrapper.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            const diffX = e.touches[0].clientX - startX;
            // 閾値を超えたらスライド
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
                isSwiping = false;
            }
        }, { passive: true });
        
        sliderWrapper.addEventListener('touchend', () => {
            isSwiping = false;
        });
    }

});
