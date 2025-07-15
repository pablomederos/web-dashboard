const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 3000;

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para servir la configuración del sitio
app.get('/api/config', async (req, res) => {
  try {
    const configPath = path.join(__dirname, 'data', 'config.json');
    const config = await fs.readFile(configPath, 'utf8');
    res.json(JSON.parse(config));
  } catch (error) {
    console.error('Error al leer la configuración:', error);
    res.status(500).json({ error: 'Error al cargar la configuración' });
  }
});

// Endpoint para servir los sitios
app.get('/api/sites', async (req, res) => {
  try {
    const sitesPath = path.join(__dirname, 'data', 'sites.json');
    const sites = await fs.readFile(sitesPath, 'utf8');
    res.json(JSON.parse(sites));
  } catch (error) {
    console.error('Error al leer los sitios:', error);
    res.status(500).json({ error: 'Error al cargar los sitios' });
  }
});

/**
 * Endpoint para verificar el estado de una URL.
 * Recibe una URL como query parameter 'url'.
 * Evita problemas de CORS al hacer la petición desde el backend.
 */
app.get('/check-status', async (req, res) => {
  const urlToCheck = req.query.url;

  if (!urlToCheck) {
    return res.status(400).json({ status: 'error', message: 'URL no proporcionada' });
  }

  try {
    // Usamos 'HEAD' para ser más eficientes, no necesitamos el body.
    // El timeout evita que la petición se quede colgada indefinidamente.
    const response = await fetch(urlToCheck, { method: 'HEAD', timeout: 5000 });

    if (response.ok) { // response.ok es true para status en el rango 200-299
      res.json({ status: 'online' });
    } else {
      res.json({ status: 'offline' });
    }
  } catch (error) {
    // Esto captura errores de red, timeouts, etc.
    console.error(`Error checking ${urlToCheck}:`, error.message);
    res.json({ status: 'offline' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
