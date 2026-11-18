// Shared theme handling with SVG icons
(function() {
  const themes = ['system', 'light', 'dark'];
  let idx = themes.indexOf(localStorage.getItem('cd_theme') || 'system');
  if (idx < 0) idx = 0;

  const icons = {
    system: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8"/></svg>`,
    light: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
    dark: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>`
  };

  function apply(t) {
    const actual = t === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : t;
    document.documentElement.setAttribute('data-theme', actual);
    localStorage.setItem('cd_theme', t);
    const btn = document.getElementById('theme-btn');
    if (btn) btn.innerHTML = icons[t] || icons.system;
  }

  window.cycleTheme = function() {
    idx = (idx + 1) % themes.length;
    apply(themes[idx]);
  };

  apply(themes[idx]);

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if ((localStorage.getItem('cd_theme') || 'system') === 'system') apply('system');
  });
})();

function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
}
