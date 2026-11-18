function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

function safeUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value, window.location.href);
    if (url.protocol === 'http:' || url.protocol === 'https:') return url.href;
  } catch (err) {
    return '';
  }
  return '';
}

function card(item) {
  const href = safeUrl(item.link);
  const name = escapeHtml(item.name || 'Untitled');
  const title = href ? `<a href="${escapeHtml(href)}">${name}</a>` : name;
  const version = item.minecraft
    ? `<p class="meta">Minecraft ${escapeHtml(item.minecraft)}</p>`
    : '';
  return `<article class="card"><h3>${title}</h3><p>${escapeHtml(item.summary || '')}</p>${version}</article>`;
}

function renderList(el, items, emptyText) {
  if (!items.length) {
    el.innerHTML = `<p class="empty">${emptyText}</p>`;
    return;
  }
  el.innerHTML = `<div class="list">${items.map(card).join('')}</div>`;
}

async function loadProjects() {
  const targets = [
    new URL('api/projects', window.location.href),
    new URL('data/projects.json', window.location.href),
  ];

  for (const url of targets) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      if (data && Array.isArray(data.mods) && Array.isArray(data.plugins)) return data;
    } catch (err) {
      // Try the static catalog next. GitHub Pages cannot run the Node server.
    }
  }
  throw new Error('Project catalog is unavailable');
}

document.addEventListener('DOMContentLoaded', async () => {
  const slots = document.querySelectorAll('[data-list]');
  if (!slots.length) return;

  try {
    const data = await loadProjects();
    slots.forEach((el) => {
      const kind = el.getAttribute('data-list');
      const items = kind === 'plugins' ? data.plugins : data.mods;
      const label = kind === 'plugins' ? 'plugins' : 'mods';
      renderList(el, items, `No ${label} listed yet. Add them in data/projects.json.`);
    });
  } catch (err) {
    slots.forEach((el) => {
      el.innerHTML = '<p class="empty">The project list could not be loaded.</p>';
    });
  }
});
