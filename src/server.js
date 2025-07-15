const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // Asegúrate de instalarlo con: npm install node-fetch@2

const app = express();
const port = process.env.PORT || 3000;

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

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
