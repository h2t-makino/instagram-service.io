/* ========================================
   業種別タブ機能
======================================== */

/**
 * 業種タブを切り替える
 * @param {string} industryId - 表示する業種のID
 */
function showIndustry(industryId) {
    // 全てのタブとコンテンツから active クラスを削除
    const tabs = document.querySelectorAll('.industry-tab');
    const contents = document.querySelectorAll('.industry-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    
    // 選択されたタブとコンテンツに active クラスを追加
    const selectedTab = document.querySelector(`.industry-tab[onclick*="${industryId}"]`);
    const selectedContent = document.getElementById(industryId);
    
    if (selectedTab && selectedContent) {
        selectedTab.classList.add('active');
        selectedContent.classList.add('active');
        
        // スムーススクロール効果のために少し遅延
        setTimeout(() => {
            selectedContent.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
    }
}

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
    
    // 業種タブの初期化
    initializeIndustryTabs();
    
    // 比較表の初期化
    initializeComparisonTable();
    
});

/**
 * 業種タブの初期化処理
 */
function initializeIndustryTabs() {
    // 最初のタブ（歯科医院）をアクティブに設定
    const firstTab = document.querySelector('.industry-tab');
    const firstContent = document.querySelector('.industry-content');
    
    if (firstTab && firstContent) {
        firstTab.classList.add('active');
        firstContent.classList.add('active');
    }
    
    // キーボードナビゲーション対応
    const tabs = document.querySelectorAll('.industry-tab');
    tabs.forEach((tab, index) => {
        tab.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' && index > 0) {
                tabs[index - 1].focus();
            } else if (e.key === 'ArrowRight' && index < tabs.length - 1) {
                tabs[index + 1].focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tab.click();
            }
        });
        
        // タブにフォーカス可能にする
        tab.setAttribute('tabindex', '0');
    });
}

/**
 * 比較表の初期化処理
 */
function initializeComparisonTable() {
    const table = document.querySelector('.service-comparison-table');
    if (!table) return;
    
    // テーブルのレスポンシブ対応
    setupTableResponsive();
    
    // テーブル行のアニメーション
    setupTableAnimation();
    
    // テーブルのアクセシビリティ向上
    setupTableAccessibility();
    
    // カテゴリ開閉機能の初期化
    initializeCategoryToggle();
}

/**
 * カテゴリ開閉機能の初期化
 */
function initializeCategoryToggle() {
    // デフォルトで最初のカテゴリのみ展開
    const firstCategory = 'category-1';
    expandCategory(firstCategory);
    
    // 他のカテゴリは閉じる
    for (let i = 2; i <= 7; i++) {
        collapseCategory(`category-${i}`);
    }
}

/**
 * カテゴリの開閉を切り替える
 * @param {string} categoryId - カテゴリID
 */
function toggleCategory(categoryId) {
    const categoryRows = document.querySelectorAll(`.${categoryId}-content`);
    const categoryHeader = document.querySelector(`[data-category="${categoryId}"]`);
    const toggle = categoryHeader.querySelector('.category-toggle');
    
    if (!categoryRows.length || !toggle) return;
    
    const isExpanded = categoryRows[0].style.display !== 'none';
    
    if (isExpanded) {
        collapseCategory(categoryId);
    } else {
        expandCategory(categoryId);
    }
}

/**
 * カテゴリを展開する
 * @param {string} categoryId - カテゴリID
 */
function expandCategory(categoryId) {
    const categoryRows = document.querySelectorAll(`.${categoryId}-content`);
    const categoryHeader = document.querySelector(`[data-category="${categoryId}"]`);
    const toggle = categoryHeader?.querySelector('.category-toggle');
    
    categoryRows.forEach((row, index) => {
        row.style.display = '';
        // スタガードアニメーション
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 50);
    });
    
    if (toggle) {
        toggle.textContent = '▼';
        toggle.style.transform = 'rotate(0deg)';
    }
    
    if (categoryHeader) {
        categoryHeader.setAttribute('aria-expanded', 'true');
    }
}

/**
 * カテゴリを閉じる
 * @param {string} categoryId - カテゴリID
 */
function collapseCategory(categoryId) {
    const categoryRows = document.querySelectorAll(`.${categoryId}-content`);
    const categoryHeader = document.querySelector(`[data-category="${categoryId}"]`);
    const toggle = categoryHeader?.querySelector('.category-toggle');
    
    categoryRows.forEach(row => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            row.style.display = 'none';
        }, 200);
    });
    
    if (toggle) {
        toggle.textContent = '▶';
        toggle.style.transform = 'rotate(-90deg)';
    }
    
    if (categoryHeader) {
        categoryHeader.setAttribute('aria-expanded', 'false');
    }
}

/**
 * すべてのカテゴリを展開
 */
function expandAllCategories() {
    for (let i = 1; i <= 7; i++) {
        expandCategory(`category-${i}`);
    }
}

/**
 * すべてのカテゴリを閉じる
 */
function collapseAllCategories() {
    for (let i = 1; i <= 7; i++) {
        collapseCategory(`category-${i}`);
    }
}

/**
 * テーブルのレスポンシブ対応
 */
function setupTableResponsive() {
    const table = document.querySelector('.service-comparison-table');
    const container = document.querySelector('.comparison-table-container');
    
    if (!table || !container) return;
    
    // 横スクロール可能であることを示すスタイルを追加
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'サービス内容比較表');
    container.setAttribute('tabindex', '0');
}

/**
 * テーブルのアニメーション設定
 */
function setupTableAnimation() {
    const rows = document.querySelectorAll('.service-comparison-table tbody tr');
    
    // Intersection Observer で行のフェードインアニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 50); // スタガードアニメーション
            }
        });
    }, observerOptions);
    
    rows.forEach((row, index) => {
        // カテゴリ行とサブカテゴリ行は除外
        if (!row.classList.contains('category-row') && !row.classList.contains('subcategory-row')) {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(row);
        }
    });
}

/**
 * テーブルのアクセシビリティ向上
 */
function setupTableAccessibility() {
    const table = document.querySelector('.service-comparison-table');
    if (!table) return;
    
    // ヘッダーセルにscopeを追加
    const headerCells = table.querySelectorAll('thead th');
    headerCells.forEach((cell, index) => {
        cell.setAttribute('scope', 'col');
    });
    
    // カテゴリ行のセルにscopeを追加
    const categoryRows = table.querySelectorAll('.category-row td');
    categoryRows.forEach(cell => {
        cell.setAttribute('scope', 'colgroup');
    });
    
    // サブカテゴリ行のセルにscopeを追加
    const subcategoryRows = table.querySelectorAll('.subcategory-row td');
    subcategoryRows.forEach(cell => {
        cell.setAttribute('scope', 'colgroup');
    });
}

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
    const animationTargets = document.querySelectorAll('.card, .achievement-card, .industry-card, .stat-card, .concern-item, .strategy-card');
    
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
   業種別コンテンツのアニメーション
======================================== */

/**
 * 業種コンテンツ切り替え時のアニメーション効果
 */
function animateIndustryContent(contentElement) {
    if (!contentElement) return;
    
    // 統計カードのスタガードアニメーション
    const statCards = contentElement.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-fade-in');
    });
    
    // 不安要素のスタガードアニメーション
    const concernItems = contentElement.querySelectorAll('.concern-item');
    concernItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.15}s`;
        item.classList.add('animate-slide-in');
    });
    
    // 戦略カードのスタガードアニメーション
    const strategyCards = contentElement.querySelectorAll('.strategy-card');
    strategyCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('animate-zoom-in');
    });
}

/* ========================================
   比較表機能
======================================== */

/**
 * 比較表の行ハイライト機能
 */
function setupTableRowHighlight() {
    const tableRows = document.querySelectorAll('.service-comparison-table tbody tr');
    
    tableRows.forEach(row => {
        // カテゴリ行とサブカテゴリ行は除外
        if (!row.classList.contains('category-row') && !row.classList.contains('subcategory-row')) {
            row.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'rgba(78, 205, 196, 0.05)';
            });
            
            row.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
            });
        }
    });
}

/**
 * 比較表のスティッキーヘッダー機能
 */
function setupStickyTableHeader() {
    const table = document.querySelector('.service-comparison-table');
    const header = document.querySelector('.service-comparison-table thead');
    
    if (!table || !header) return;
    
    let isSticky = false;
    
    window.addEventListener('scroll', function() {
        const tableRect = table.getBoundingClientRect();
        const shouldBeSticky = tableRect.top <= 0 && tableRect.bottom > 0;
        
        if (shouldBeSticky && !isSticky) {
            header.style.position = 'sticky';
            header.style.top = '0';
            header.style.zIndex = '10';
            header.style.backgroundColor = 'white';
            header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            isSticky = true;
        } else if (!shouldBeSticky && isSticky) {
            header.style.position = '';
            header.style.top = '';
            header.style.zIndex = '';
            header.style.backgroundColor = '';
            header.style.boxShadow = '';
            isSticky = false;
        }
    });
}

/**
 * 比較表のフィルタリング機能
 */
function setupTableFiltering() {
    const filterButtons = document.querySelectorAll('.table-filter-btn');
    const tableRows = document.querySelectorAll('.service-comparison-table tbody tr');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // アクティブボタンの切り替え
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 行の表示/非表示
            tableRows.forEach(row => {
                if (filter === 'all') {
                    row.style.display = '';
                } else if (filter === 'standard-only') {
                    // スタンダードプランで提供されるサービスのみ表示
                    const standardCell = row.querySelector('.feature-check');
                    if (standardCell && standardCell.textContent.includes('✔︎')) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                } else if (filter === 'premium-only') {
                    // フルパッケージプランのみで提供されるサービスを表示
                    const standardCell = row.cells[1];
                    const premiumCell = row.cells[2];
                    if (standardCell && premiumCell && 
                        standardCell.textContent.includes('×') && 
                        premiumCell.textContent.includes('✔︎')) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    });
}

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

/**
 * 業種タブのキーボードナビゲーション
 * @param {Event} event - キーボードイベント
 * @param {string} industryId - 業種ID
 */
function handleTabKeydown(event, industryId) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showIndustry(industryId);
    }
}

/**
 * 比較表の行をハイライト
 * @param {HTMLElement} row - ハイライトする行
 */
function highlightTableRow(row) {
    // 既存のハイライトを削除
    const highlightedRows = document.querySelectorAll('.table-row-highlighted');
    highlightedRows.forEach(r => r.classList.remove('table-row-highlighted'));
    
    // 新しい行をハイライト
    row.classList.add('table-row-highlighted');
    
    // 一定時間後にハイライトを削除
    setTimeout(() => {
        row.classList.remove('table-row-highlighted');
    }, 3000);
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
   比較表の追加初期化
======================================== */
window.addEventListener('load', function() {
    // 比較表関連の機能を初期化
    setupTableRowHighlight();
    setupStickyTableHeader();
    setupTableFiltering();
    
    // レスポンシブ対応でのテーブル初期化
    handleTableResponsive();
});

/**
 * テーブルのレスポンシブ対応処理
 */
function handleTableResponsive() {
    const table = document.querySelector('.service-comparison-table');
    const container = document.querySelector('.comparison-table-container');
    
    if (!table || !container) return;
    
    function checkTableOverflow() {
        const tableWidth = table.scrollWidth;
        const containerWidth = container.clientWidth;
        
        if (tableWidth > containerWidth) {
            container.classList.add('table-overflow');
            // スクロール可能であることを示すインジケータを追加
            if (!container.querySelector('.scroll-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'scroll-indicator';
                indicator.textContent = '← → スクロールできます';
                container.appendChild(indicator);
            }
        } else {
            container.classList.remove('table-overflow');
            const indicator = container.querySelector('.scroll-indicator');
            if (indicator) {
                indicator.remove();
            }
        }
    }
    
    // 初回チェック
    checkTableOverflow();
    
    // リサイズ時にチェック
    window.addEventListener('resize', throttle(checkTableOverflow, 250));
}

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
        const animationTargets = document.querySelectorAll('.card, .achievement-card, .industry-card, .stat-card, .concern-item, .strategy-card');
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

/* ========================================
   アクセシビリティ向上
======================================== */

/**
 * キーボードナビゲーションの改善
 */
function enhanceKeyboardNavigation() {
    // フォーカス可能な要素を管理
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // フォーカストラップの実装（モーダル用）
    function trapFocus(container) {
        const focusableEls = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusableEl = focusableEls[0];
        const lastFocusableEl = focusableEls[focusableEls.length - 1];
        
        container.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableEl) {
                        lastFocusableEl.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableEl) {
                        firstFocusableEl.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    // フローティング目次のフォーカストラップ
    const floatingTocMenu = document.getElementById('floatingTocMenu');
    if (floatingTocMenu) {
        trapFocus(floatingTocMenu);
    }
    
    // 比較表のキーボードナビゲーション
    const table = document.querySelector('.service-comparison-table');
    if (table) {
        setupTableKeyboardNavigation(table);
    }
}

/**
 * 比較表のキーボードナビゲーション設定
 */
function setupTableKeyboardNavigation(table) {
    const cells = table.querySelectorAll('td, th');
    let currentCellIndex = 0;
    
    // セルにtabindexを設定
    cells.forEach((cell, index) => {
        cell.setAttribute('tabindex', index === 0 ? '0' : '-1');
        cell.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    navigateTable(1, 0);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    navigateTable(-1, 0);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    navigateTable(0, 1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    navigateTable(0, -1);
                    break;
            }
        });
    });
    
    function navigateTable(colDelta, rowDelta) {
        const currentCell = document.activeElement;
        const currentRow = currentCell.parentElement;
        const currentColIndex = Array.from(currentRow.children).indexOf(currentCell);
        const currentRowIndex = Array.from(currentRow.parentElement.children).indexOf(currentRow);
        
        const newRowIndex = currentRowIndex + rowDelta;
        const newColIndex = currentColIndex + colDelta;
        
        const rows = table.querySelectorAll('tr');
        if (newRowIndex >= 0 && newRowIndex < rows.length) {
            const newRow = rows[newRowIndex];
            const newCells = newRow.children;
            if (newColIndex >= 0 && newColIndex < newCells.length) {
                const newCell = newCells[newColIndex];
                currentCell.setAttribute('tabindex', '-1');
                newCell.setAttribute('tabindex', '0');
                newCell.focus();
            }
        }
    }
}

// ページ読み込み後にアクセシビリティ機能を初期化
document.addEventListener('DOMContentLoaded', enhanceKeyboardNavigation);