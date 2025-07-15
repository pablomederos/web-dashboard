document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('grid-container');

  // (2) Leer el documento JSON cada vez que se accede al sitio.
  fetch('data/sites.json')
    .then(response => response.json())
    .then(sites => {
      if (sites.length === 0) {
        gridContainer.innerHTML = '<p>No hay sitios configurados en sites.json</p>';
        return;
      }
      sites.forEach(site => {
        const card = createSiteCard(site);
        gridContainer.appendChild(card);
        // (3) Testear si la URL está viva.
        checkSiteStatus(site, card);
      });
    })
    .catch(error => {
      console.error('Error al cargar el archivo de sitios:', error);
      gridContainer.innerHTML = '<p>Error al cargar la configuración de sitios.</p>';
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