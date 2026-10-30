document.addEventListener('DOMContentLoaded', () => {
  const frame = document.querySelector('#indicators-frame');
  const status = document.querySelector('#indicators-frame-status');
  const error = document.querySelector('#indicators-frame-error');
  const loadError = document.querySelector('#indicators-frame-load-error');

  if (!frame || !status || !error || !loadError) {
    return;
  }

  const showUnavailable = () => {
    status.classList.add('d-none');
    error.classList.remove('d-none');
    loadError.classList.add('d-none');
  };

  // The RShiny application is cross-origin, so its document and internal data
  // states are intentionally not inspected from the Oasisbr theme.
  const timeout = window.setTimeout(showUnavailable, 15000);
  frame.addEventListener('load', () => {
    window.clearTimeout(timeout);
    status.classList.add('d-none');
    error.classList.add('d-none');
    loadError.classList.add('d-none');
  });
  frame.addEventListener('error', () => {
    window.clearTimeout(timeout);
    status.classList.add('d-none');
    error.classList.add('d-none');
    loadError.classList.remove('d-none');
  });
});
