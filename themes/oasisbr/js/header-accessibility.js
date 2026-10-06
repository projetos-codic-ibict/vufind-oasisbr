document.addEventListener('DOMContentLoaded', () => {
  const storageKeys = { contrast: 'oasisbr-accessibility-contrast', fontSize: 'oasisbr-accessibility-font-size' };
  const minFontSize = 14;
  const defaultFontSize = 16;
  const maxFontSize = 20;
  const menu = document.getElementById('header-collapse');
  const toggler = document.querySelector('.oasis-header-toggler');
  const contrastButton = document.querySelector('[data-oasis-contrast]');
  const vlibrasButton = document.querySelector('[data-oasis-vlibras]');

  const getStorage = (key) => {
    try { return window.localStorage.getItem(key); } catch (error) { return null; }
  };
  const setStorage = (key, value) => {
    try { window.localStorage.setItem(key, value); } catch (error) { /* Current-page behavior remains available. */ }
  };
  const focusTarget = (target) => {
    if (!target) return false;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'start', behavior: 'auto' });
    return true;
  };
  const focusMenu = () => focusTarget(menu?.querySelector('a:not([hidden]), button:not([hidden])') || menu);
  const goToMenu = () => {
    if (!menu || !toggler) return false;
    if (menu.classList.contains('show')) return focusMenu();
    menu.addEventListener('shown.bs.collapse', focusMenu, { once: true });
    toggler.click();
    return true;
  };
  const goToSearch = (fallbackUrl) => {
    if (focusTarget(document.getElementById('searchForm_lookfor'))) return true;
    if (!fallbackUrl) return false;
    window.location.assign(fallbackUrl + '#searchForm_lookfor');
    return true;
  };
  const performShortcut = (action, fallbackUrl) => {
    if (action === 'content') return focusTarget(document.getElementById('content'));
    if (action === 'menu') return goToMenu();
    if (action === 'search') return goToSearch(fallbackUrl);
    return false;
  };
  const applyContrast = (enabled) => {
    document.body.classList.toggle('oasis-high-contrast', enabled);
    contrastButton?.setAttribute('aria-pressed', String(enabled));
    setStorage(storageKeys.contrast, enabled ? 'true' : 'false');
  };
  const applyFontSize = (size) => {
    const safeSize = Math.min(maxFontSize, Math.max(minFontSize, size));
    document.documentElement.style.fontSize = safeSize + 'px';
    setStorage(storageKeys.fontSize, String(safeSize));
  };

  document.querySelectorAll('[data-oasis-shortcut]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (performShortcut(link.dataset.oasisShortcut, link.dataset.oasisSearchUrl)) event.preventDefault();
    });
  });
  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const typing = target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]');
    if (typing || !event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const action = { 1: 'content', 2: 'menu', 3: 'search' }[event.key];
    if (!action) return;
    const searchLink = document.querySelector('[data-oasis-shortcut="search"]');
    if (performShortcut(action, searchLink?.dataset.oasisSearchUrl)) event.preventDefault();
  });
  contrastButton?.addEventListener('click', () => applyContrast(!document.body.classList.contains('oasis-high-contrast')));
  document.querySelectorAll('[data-oasis-font-size]').forEach((button) => {
    button.addEventListener('click', () => {
      const current = Number.parseInt(getStorage(storageKeys.fontSize) || defaultFontSize, 10);
      const operation = button.dataset.oasisFontSize;
      applyFontSize(operation === 'increase' ? current + 1 : operation === 'decrease' ? current - 1 : defaultFontSize);
    });
  });

  const initializeVLibras = () => {
    const widget = document.getElementById('oasis-vlibras-widget');
    if (!widget || !window.VLibras) return false;
    if (!widget.dataset.initialized) {
      new window.VLibras.Widget('https://vlibras.gov.br/app');
      widget.dataset.initialized = 'true';
    }
    vlibrasButton?.removeAttribute('disabled');
    return true;
  };
  vlibrasButton?.addEventListener('click', () => {
    if (initializeVLibras()) document.querySelector('#oasis-vlibras-widget [vw-access-button]')?.click();
  });

  applyContrast(getStorage(storageKeys.contrast) === 'true');
  const savedFontSize = Number.parseInt(getStorage(storageKeys.fontSize) || defaultFontSize, 10);
  applyFontSize(Number.isNaN(savedFontSize) ? defaultFontSize : savedFontSize);
  initializeVLibras();
});
