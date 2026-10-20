document.addEventListener('DOMContentLoaded', function () {
  function revealHashTarget() {
    const targetId = window.location.hash.slice(1);
    const collapseElement = targetId && document.getElementById(targetId);
    const button = Array.from(
      document.querySelectorAll('[data-bs-toggle="collapse"]')
    ).find(function (control) {
      return control.getAttribute('data-bs-target') === `#${targetId}`
        && control.getAttribute('aria-controls') === targetId;
    });

    if (!collapseElement || !button || !collapseElement.classList.contains('collapse')) {
      return;
    }

    const reveal = function () {
      button.closest('h2').scrollIntoView({ block: 'start' });
      button.focus({ preventScroll: true });
    };

    const synchronizeControl = function () {
      button.classList.remove('collapsed');
      button.setAttribute('aria-expanded', 'true');
    };

    if (collapseElement.classList.contains('show')) {
      synchronizeControl();
      reveal();
      return;
    }

    collapseElement.addEventListener('shown.bs.collapse', function () {
      synchronizeControl();
      reveal();
    }, { once: true });

    if (window.bootstrap && window.bootstrap.Collapse) {
      window.bootstrap.Collapse.getOrCreateInstance(collapseElement, { toggle: false }).show();
    } else {
      collapseElement.classList.add('show');
      synchronizeControl();
      reveal();
    }
  }

  revealHashTarget();
  window.addEventListener('hashchange', revealHashTarget);
  window.addEventListener('oasisbr:reveal-faq-hash', revealHashTarget);
});
