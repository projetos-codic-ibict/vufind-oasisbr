const initializeRecordDetailsToggle = () => {
  const toggle = document.querySelector('.oasis-record-details-toggle');
  const tab = document.querySelector('.record-tabs [data-tab="details"]');
  const panel = document.querySelector('#record-tab-panel-details');

  if (!toggle || !tab || !panel) {
    return;
  }

  const setExpanded = (expanded) => {
    toggle.setAttribute('aria-expanded', String(expanded));
    tab.classList.toggle('active', expanded);
    panel.classList.toggle('active', expanded);
  };

  setExpanded(panel.classList.contains('active'));

  document.addEventListener('focus', (event) => {
    if (event.target === toggle) {
      event.stopImmediatePropagation();
    }
  }, true);

  document.addEventListener('click', (event) => {
    if (event.target !== toggle && !toggle.contains(event.target)) {
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    setExpanded(!panel.classList.contains('active'));
  }, true);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeRecordDetailsToggle);
} else {
  initializeRecordDetailsToggle();
}
