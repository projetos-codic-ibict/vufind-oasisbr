document.addEventListener('DOMContentLoaded', () => {
  const page = document.querySelector('[data-oasis-accessibility-page]');
  if (!page) return;
  const toggle = page.querySelector('[data-oasis-barrier-toggle]');
  const box = document.getElementById('form-barreira');
  const setOpen = (open, moveFocus) => {
    box.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (!moveFocus) return;
    const target = open ? box.querySelector('[role="status"], input, select, textarea') : toggle;
    target?.focus();
  };
  if (toggle && box) {
    setOpen(toggle.getAttribute('aria-expanded') === 'true', false);
    toggle.addEventListener('click', () => setOpen(box.hidden, true));
    page.querySelectorAll('[data-oasis-barrier-cancel]').forEach((button) => button.addEventListener('click', () => setOpen(false, true)));
    const status = box.querySelector('[role="status"], [role="alert"]');
    if (status && !box.hidden) status.focus();
  }
});
