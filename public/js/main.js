/**
 * Modern Tech Blog Interactive Suite
 * - Dark Mode Switcher & Persistence
 * - Reading Progress Bar
 * - Sticky ToC ScrollSpy
 * - Code Copy Buttons
 * - Spotlight Live Search (Ctrl + K)
 */

document.addEventListener('DOMContentLoaded', function () {
  initThemeToggle();
  initReadingProgressBar();
  initTocScrollSpy();
  initCodeCopyButtons();
  initSearchModal();
  initBackToTop();
});

/* ==========================================================================
   1. Dark / Light Mode Toggle
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  function updateThemeUI(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  // Leer estado inicial
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  updateThemeUI(currentTheme);

  toggleBtn.addEventListener('click', function () {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    updateThemeUI(next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
  });
}

/* ==========================================================================
   2. Reading Progress Bar
   ========================================================================== */
function initReadingProgressBar() {
  const progressBar = document.getElementById('reading-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', function () {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
  }, { passive: true });
}

/* ==========================================================================
   3. Sticky ToC ScrollSpy
   ========================================================================== */
function initTocScrollSpy() {
  const tocNav = document.getElementById('TableOfContents');
  const articleBody = document.getElementById('article-body');
  if (!tocNav || !articleBody) return;

  const headings = articleBody.querySelectorAll('h1, h2, h3, h4');
  const tocLinks = tocNav.querySelectorAll('a');
  if (!headings.length || !tocLinks.length) return;

  function setActiveHeading() {
    let activeId = '';
    const scrollPos = window.scrollY + 140;

    headings.forEach(function (heading) {
      if (heading.offsetTop <= scrollPos) {
        activeId = heading.getAttribute('id') || '';
      }
    });

    tocLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href && href === '#' + activeId) {
        link.classList.add('toc-active');
      } else {
        link.classList.remove('toc-active');
      }
    });
  }

  window.addEventListener('scroll', setActiveHeading, { passive: true });
  setActiveHeading();
}

/* ==========================================================================
   4. Code Copy Buttons
   ========================================================================== */
function initCodeCopyButtons() {
  const codeBlocks = document.querySelectorAll('pre');
  codeBlocks.forEach(function (pre) {
    if (pre.querySelector('.code-copy-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Copiar código');
    btn.innerHTML = '<i class="fa-regular fa-copy"></i> <span class="copy-label">Copiar</span>';

    btn.addEventListener('click', function () {
      const code = pre.querySelector('code') || pre;
      const textToCopy = code.innerText.trim();
      navigator.clipboard.writeText(textToCopy).then(function () {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> <span class="copy-label">¡Copiado!</span>';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.innerHTML = '<i class="fa-regular fa-copy"></i> <span class="copy-label">Copiar</span>';
          btn.classList.remove('copied');
        }, 2200);
      });
    });

    pre.style.position = 'relative';
    pre.appendChild(btn);
  });
}

/* ==========================================================================
   5. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('btn-back-to-top');
  if (!btn) return;
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   6. Spotlight Live Search (Ctrl + K)
   ========================================================================== */
function initSearchModal() {
  const searchTrigger = document.getElementById('search-trigger-btn');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchClose = document.getElementById('search-close-btn');

  if (!searchModal || !searchInput || !searchResults) return;

  let searchIndex = null;
  let isLoading = false;
  let selectedIndex = -1;

  function loadSearchIndex() {
    if (searchIndex || isLoading) return;
    isLoading = true;
    searchResults.innerHTML = '<div class="search-loading"><i class="fa-solid fa-spinner fa-spin"></i> Cargando índice de artículos...</div>';

    fetch('/index.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        searchIndex = data;
        isLoading = false;
        renderResults(searchInput.value.trim());
      })
      .catch(function (err) {
        isLoading = false;
        searchResults.innerHTML = '<div class="search-empty">No se pudo cargar el índice de búsqueda.</div>';
      });
  }

  function openSearch() {
    searchModal.classList.add('search-modal-open');
    document.body.style.overflow = 'hidden';
    searchInput.focus();
    selectedIndex = -1;
    loadSearchIndex();
  }

  function closeSearch() {
    searchModal.classList.remove('search-modal-open');
    document.body.style.overflow = '';
    searchInput.value = '';
    searchResults.innerHTML = '<div class="search-placeholder">Escribí una palabra clave para buscar tutoriales, código o herramientas...</div>';
  }

  if (searchTrigger) {
    searchTrigger.addEventListener('click', openSearch);
  }
  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  // Cerrar al hacer clic en el backdrop
  searchModal.addEventListener('click', function (e) {
    if (e.target === searchModal) {
      closeSearch();
    }
  });

  // Atajos de Teclado Globales: Ctrl+K / Cmd+K y Esc
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchModal.classList.contains('search-modal-open')) {
        closeSearch();
      } else {
        openSearch();
      }
    } else if (e.key === 'Escape' && searchModal.classList.contains('search-modal-open')) {
      closeSearch();
    }
  });

  // Filtrado en vivo
  searchInput.addEventListener('input', function () {
    selectedIndex = -1;
    renderResults(this.value.trim());
  });

  // Navegación por teclado dentro de los resultados
  searchInput.addEventListener('keydown', function (e) {
    const items = searchResults.querySelectorAll('.search-result-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      updateSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      updateSelection(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && items[selectedIndex]) {
        items[selectedIndex].click();
      }
    }
  });

  function updateSelection(items) {
    items.forEach(function (item, idx) {
      if (idx === selectedIndex) {
        item.classList.add('search-result-selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('search-result-selected');
      }
    });
  }

  function renderResults(query) {
    if (!searchIndex) return;

    if (!query) {
      searchResults.innerHTML = '<div class="search-placeholder">Escribí una palabra clave para buscar tutoriales, código o herramientas...</div>';
      return;
    }

    const q = query.toLowerCase();
    const matches = searchIndex.filter(function (post) {
      const matchTitle = (post.title || '').toLowerCase().includes(q);
      const matchDesc = (post.description || '').toLowerCase().includes(q);
      const matchContent = (post.content || '').toLowerCase().includes(q);
      const matchTags = (post.tags || []).some(function (t) { return t.toLowerCase().includes(q); });
      return matchTitle || matchDesc || matchContent || matchTags;
    });

    if (!matches.length) {
      searchResults.innerHTML = '<div class="search-empty"><i class="fa-regular fa-face-frown"></i> No se encontraron resultados para "<strong>' + escapeHTML(query) + '</strong>".</div>';
      return;
    }

    let html = '';
    matches.slice(0, 10).forEach(function (post) {
      const tagsHtml = (post.tags || []).slice(0, 3).map(function (t) {
        return '<span class="search-tag">#' + escapeHTML(t) + '</span>';
      }).join('');

      html += '<a href="' + post.permalink + '" class="search-result-item">' +
        '<div class="search-result-icon"><i class="fa-solid fa-file-lines"></i></div>' +
        '<div class="search-result-info">' +
          '<div class="search-result-title">' + highlightText(post.title, q) + '</div>' +
          '<div class="search-result-desc">' + highlightText(post.description || post.content || '', q) + '</div>' +
          '<div class="search-result-meta">' +
            '<span class="search-date">📅 ' + (post.date || '') + '</span>' +
            tagsHtml +
          '</div>' +
        '</div>' +
        '<div class="search-result-arrow"><i class="fa-solid fa-chevron-right"></i></div>' +
      '</a>';
    });

    searchResults.innerHTML = html;
  }

  function highlightText(text, query) {
    if (!text || !query) return escapeHTML(text || '');
    const escapedText = escapeHTML(text);
    const regex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
