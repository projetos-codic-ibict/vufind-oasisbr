document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-oasis-team]');
  if (!root) return;
  const tabs = root.querySelectorAll('[data-oasis-team-tab]');
  const panels = root.querySelectorAll('[data-oasis-team-panel]');
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    const selected = tab.dataset.oasisTeamTab;
    tabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    panels.forEach((panel) => { panel.hidden = panel.dataset.oasisTeamPanel !== selected; });
  }));
});
