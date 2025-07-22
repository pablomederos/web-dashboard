document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('grid-container');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');
  const headerTitle = document.getElementById('header-title');
  const siteFooter = document.getElementById('site-footer');
  let allSites = [];

  fetch('/api/config')
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo cargar la configuración');
      }
      return response.json();
    })
    .then(config => {
      document.title = config.site.title;
      headerTitle.textContent = config.site.title;

      const footerContent = document.createElement('div');
      footerContent.innerHTML = `
        ${config.site.footer.copyright} ${config.site.footer.author} · 
        ${config.site.footer.links.map(link => 
          `<a href="${link.url}" target="_blank" rel="noopener">${link.text}</a>`
        ).join(' · ')}
      `;
      siteFooter.appendChild(footerContent);
    })
    .catch(error => console.error('Error loading config:', error));

  fetch('/api/sites')
    .then(response => response.json())
    .then(sites => {
      allSites = sites;
      renderSites(sites);
    })
    .catch(error => {
      console.error('Error al cargar el archivo de sitios:', error);
      gridContainer.innerHTML = '<p>Error al cargar la configuración de sitios.</p>';
    });

  function renderSites(sites) {
    gridContainer.innerHTML = '';
    if (!sites || sites.length === 0) {
      gridContainer.innerHTML = '<p>No hay sitios configurados en sites.json</p>';
      return;
    }
    sites.forEach(site => {
      const card = createSiteCard(site);
      gridContainer.appendChild(card);
      checkSiteStatus(site, card);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const value = e.target.value.trim().toLowerCase();
      if (!value) {
        renderSites(allSites);
        return;
      }
      const filtered = allSites.filter(site =>
        site.name.toLowerCase().includes(value) ||
        site.url.toLowerCase().includes(value)
      );
      renderSites(filtered);
    });
  }
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      renderSites(allSites);
      searchInput.focus();
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
  });
});

async function getFavicon(url) {
  // Intenta primero con Google Favicon Service a través de nuestro proxy
  try {
    const response = await fetch(`/api/favicon/google?url=${encodeURIComponent(url)}`);
    if (response.ok && response.headers.get('content-type').startsWith('image/')) {
      return response.url;
    }
  } catch (error) {
    console.warn('Error al obtener favicon de Google:', error);
  }

  // Si falla Google, intenta obtener el favicon directamente del sitio a través de nuestro proxy
  try {
    const response = await fetch(`/api/favicon/site?url=${encodeURIComponent(url)}`);
    if (response.ok && response.headers.get('content-type').startsWith('image/')) {
      return response.url;
    }
  } catch (error) {
    console.warn('Error al obtener favicon del sitio:', error);
  }

  // Si todo falla, retorna null
  return null;
}

function createSiteCard(site) {
  const card = document.createElement('a');
  card.className = 'site-card';
  card.href = site.url;
  card.rel = 'noopener noreferrer';

  const favicon = document.createElement('img');
  favicon.className = 'favicon';
  favicon.alt = 'favicon';
  favicon.src = '/favicon.ico'; // Favicon por defecto mientras se carga

  // Intenta obtener el favicon
  getFavicon(site.url).then(faviconUrl => {
    if (faviconUrl) {
      favicon.src = faviconUrl;
    }
  });

  const siteName = document.createElement('span');
  siteName.className = 'site-name';
  siteName.textContent = site.name;

  const statusLight = document.createElement('div');
  statusLight.className = 'status-light yellow';

  card.appendChild(favicon);
  card.appendChild(siteName);
  card.appendChild(statusLight);
  return card;
}

async function checkSiteStatus(site, cardElement) {
  const statusLight = cardElement.querySelector('.status-light');
  const response = await fetch(`/check-status?url=${encodeURIComponent(site.url)}`);
  const result = await response.json();
  
  statusLight.classList.add(result.status === 'online' ? 'green' : 'red');
}