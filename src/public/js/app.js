document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('grid-container');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');
  const siteTitle = document.getElementById('site-title');
  const headerTitle = document.getElementById('header-title');
  const siteFooter = document.getElementById('site-footer');
  let allSites = [];

  // Cargar la configuración del sitio
  fetch('/api/config')
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo cargar la configuración');
      }
      return response.json();
    })
    .then(config => {
      // Aplicar título
      document.title = config.site.title;
      headerTitle.textContent = config.site.title;

      // Construir footer
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

  // Leer el documento JSON cada vez que se accede al sitio.
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

  // Filtrado en tiempo real
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

  // Atajo Ctrl+K para enfocar la barra de búsqueda
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
  });
});

function createSiteCard(site) {
  const card = document.createElement('a');
  card.className = 'site-card';
  card.href = site.url;
  card.target = '_blank'; // Abrir en una nueva pestaña
  card.rel = 'noopener noreferrer';

  // Favicon a la izquierda
  const favicon = document.createElement('img');
  favicon.className = 'favicon';
  favicon.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(site.url)}`;
  favicon.alt = 'favicon';

  // Nombre del sitio en el centro
  const siteName = document.createElement('span');
  siteName.className = 'site-name';
  siteName.textContent = site.name;

  // Semáforo a la derecha
  const statusLight = document.createElement('div');
  statusLight.className = 'status-light yellow'; // Inicia en amarillo mientras se verifica

  card.appendChild(favicon);
  card.appendChild(siteName);
  card.appendChild(statusLight);
  return card;
}

async function checkSiteStatus(site, cardElement) {
  const statusLight = cardElement.querySelector('.status-light');
  const response = await fetch(`/check-status?url=${encodeURIComponent(site.url)}`);
  const result = await response.json();
  
  statusLight.className = 'status-light'; // Resetea clases
  statusLight.classList.add(result.status === 'online' ? 'green' : 'red');
}