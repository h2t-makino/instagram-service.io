/* ========================================
   フローティング目次機能
======================================== */

/**
 * フローティング目次の表示/非表示を切り替える
 */
function toggleFloatingToc() {
    const menu = document.getElementById('floatingTocMenu');
    menu.classList.toggle('active');
}

/**
 * フローティング目次を閉じる
 */
function closeFloatingToc() {
    const menu = document.getElementById('floatingTocMenu');
    menu.classList.remove('active');
}

/* ========================================
   ページ読み込み後の初期化処理
======================================== */
document.addEventListener('DOMContentLoaded', function() {
    
    // クリック外でフローティング目次を閉じる処理
    setupFloatingTocClickOutside();
    
    // スムーススクロールの設定
    setupSmoothScroll();
    
    // 目次リンクのクリック時処理
    setupTocLinkClicks();
    
});

/**
 * フローティング目次のクリック外での閉じる処理を設定
 */
function setupFloatingTocClickOutside() {
    document.addEventListener('click', function(event) {
        const toc = document.querySelector('.floating-toc');
        const menu = document.getElementById('floatingTocMenu');
        
        // フローティング目次の要素外をクリックした場合にメニューを閉じる
        if (toc && !toc.contains(event.target)) {
            menu.classList.remove('active');
        }
    });
}

/**
 * スムーススクロールの設定
 */
function setupSmoothScroll() {
    // すべての目次リンクにスムーススクロールを適用
    const tocLinks = document.querySelectorAll('a[href^="#section-"]');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // ヘッダーの高さ分を考慮したオフセット
                const offset = 80;
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 目次リンクのクリック時処理を設定
 */
function setupTocLinkClicks() {
    // 通常の目次リンクのクリック処理
    const mainTocLinks = document.querySelectorAll('.toc-item a');
    mainTocLinks.forEach(link => {
        link.addEventListener('click', function() {
            // 特に追加の処理は不要（スムーススクロールで対応）
        });
    });
    
    // フローティング目次リンクのクリック処理
    const floatingTocLinks = document.querySelectorAll('.floating-toc-link');
    floatingTocLinks.forEach(link => {
        link.addEventListener('click', function() {
            // フローティング目次を閉じる
            closeFloatingToc();
        });
    });
}

/* ========================================
   スクロール連動処理
======================================== */

/**
 * 現在表示されているセクションを検出してハイライト
 */
function highlightCurrentSection() {
    const sections = document.querySelectorAll('.section[id^="section-"]');
    const tocLinks = document.querySelectorAll('.floating-toc-link');
    
    let currentSection = null;
    const scrollPosition = window.scrollY + 100; // オフセット調整
    
    // 現在のスクロール位置に対応するセクションを検出
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSection = section.id;
        }
    });
    
    // 目次リンクのハイライトを更新
    tocLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1); // #を除去
        if (href === currentSection) {
            link.style.backgroundColor = 'var(--primary-light)';
            link.style.color = 'var(--primary-dark)';
        } else {
            link.style.backgroundColor = '';
            link.style.color = '';
        }
    });
}

// スクロールイベントでセクションハイライトを更新
window.addEventListener('scroll', highlightCurrentSection);

/* ========================================
   アニメーション効果
======================================== */

/**
 * 要素が画面に入った時のフェードインアニメーション
 */
function setupScrollAnimations() {
    // Intersection Observer APIを使用して要素の表示を監視
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // アニメーション対象の要素を監視対象に追加
    const animationTargets = document.querySelectorAll('.card, .achievement-card, .industry-card');
    
    animationTargets.forEach(target => {
        // 初期状態を設定
        target.style.opacity = '0';
        target.style.transform = 'translateY(20px)';
        target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(target);
    });
}

// ページ読み込み完了後にアニメーションを設定
window.addEventListener('load', setupScrollAnimations);

/* ========================================
   ユーティリティ関数
======================================== */

/**
 * 指定されたセクションまでスクロール
 * @param {string} sectionId - セクションのID
 */
function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        const offset = 80;
        const targetPosition = targetElement.offsetTop - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * トップに戻る関数
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/* ========================================
   パフォーマンス最適化
======================================== */

/**
 * スクロールイベントのスロットリング
 */
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// スクロールイベントをスロットリング（16ms = 60fps相当）
const throttledHighlight = throttle(highlightCurrentSection, 16);
window.removeEventListener('scroll', highlightCurrentSection);
window.addEventListener('scroll', throttledHighlight);

/* ========================================
   エラーハンドリング
======================================== */

/**
 * グローバルエラーハンドラー
 */
window.addEventListener('error', function(e) {
    console.error('JavaScript エラーが発生しました:', e.error);
    // 本番環境では適切なエラー報告サービスに送信
});

/**
 * 未処理のPromise拒否をキャッチ
 */
window.addEventListener('unhandledrejection', function(e) {
    console.error('未処理のPromise拒否:', e.reason);
    // 本番環境では適切なエラー報告サービスに送信
});

/* ========================================
   ブラウザ互換性対応
======================================== */

/**
 * Intersection Observer APIの代替実装
 */
if (!('IntersectionObserver' in window)) {
    // 古いブラウザ向けの代替実装
    console.warn('Intersection Observer APIがサポートされていません。代替実装を使用します。');
    
    // スクロールベースの簡易実装
    function fallbackScrollAnimation() {
        const animationTargets = document.querySelectorAll('.card, .achievement-card, .industry-card');
        const windowHeight = window.innerHeight;
        
        animationTargets.forEach(target => {
            const targetTop = target.getBoundingClientRect().top;
            
            if (targetTop < windowHeight * 0.8) {
                target.style.opacity = '1';
                target.style.transform = 'translateY(0)';
            }
        });
    }
    
    window.addEventListener('scroll', throttle(fallbackScrollAnimation, 16));
    window.addEventListener('load', fallbackScrollAnimation);
}