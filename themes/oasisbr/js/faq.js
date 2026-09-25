document.addEventListener('DOMContentLoaded', function () {
  const hash = window.location.hash;

  if (!hash) {
    return;
  }

  const targetId = hash.substring(1);
  const collapseElement = document.getElementById(targetId);

  if (!collapseElement || !collapseElement.classList.contains('collapse')) {
    return;
  }

  const button = document.querySelector(
    `[data-bs-target="#${targetId}"]`
  );

  if (!button) {
    return;
  }

  button.click();

  setTimeout(function () {
    collapseElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, 300);
});