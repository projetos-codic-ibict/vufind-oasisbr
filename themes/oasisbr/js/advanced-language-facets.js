document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#advSearchForm');
  if (!form) {
    return;
  }

  const resetAliases = () => {
    form.querySelectorAll('[data-language-alias-filter]').forEach((input) => input.remove());
    form.querySelectorAll('option[data-language-filters][disabled]').forEach((option) => {
      option.disabled = false;
    });
  };

  form.addEventListener('submit', () => {
    resetAliases();
    form.querySelectorAll('option[data-language-filters]:checked').forEach((option) => {
      JSON.parse(option.dataset.languageFilters).forEach((filter) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'filter[]';
        input.value = filter;
        input.dataset.languageAliasFilter = 'true';
        form.append(input);
      });
      option.disabled = true;
    });
  });

  window.addEventListener('pageshow', resetAliases);
});
