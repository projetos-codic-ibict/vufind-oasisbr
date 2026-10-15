(() => {
  const initRecordSidebar = () => {
    const format = document.querySelector('#oasis-citation-format');
    const copyButton = document.querySelector('.oasis-copy-citation');
    const status = document.querySelector('#oasis-citation-status');
    if (!format || !copyButton || !status) {
      return;
    }

    const getCitation = () => document.querySelector(
      `.oasis-record-citation[data-citation-format="${CSS.escape(format.value)}"]`
    );
    let statusTimeout;
    const showStatus = (message, state) => {
      window.clearTimeout(statusTimeout);
      status.replaceChildren();
      status.className = `oasis-citation-status is-${state}`;

      if (state === 'success') {
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-check';
        icon.setAttribute('aria-hidden', 'true');
        status.append(icon);
      }
      status.append(document.createTextNode(message));

      if (state === 'success') {
        statusTimeout = window.setTimeout(() => {
          status.replaceChildren();
          status.className = 'oasis-citation-status';
        }, 3000);
      }
    };
    const showCitation = () => {
      document.querySelectorAll('.oasis-record-citation').forEach((citation) => {
        citation.hidden = citation.dataset.citationFormat !== format.value;
      });
    };

    format.addEventListener('change', showCitation);
    copyButton.addEventListener('click', async () => {
      const citation = getCitation();
      if (!citation) {
        showStatus(copyButton.dataset.failure, 'error');
        return;
      }
      try {
        await navigator.clipboard.writeText(citation.textContent.trim());
        showStatus(copyButton.dataset.success, 'success');
      } catch (error) {
        showStatus(copyButton.dataset.failure, 'error');
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRecordSidebar);
  } else {
    initRecordSidebar();
  }
})();
