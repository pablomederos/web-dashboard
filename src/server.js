const express = require('express')
const path = require('path')
const fetch = require('node-fetch')
const fs = require('fs').promises

const app = express()
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

app.get('/api/config', async (_, res) => {
  try {
    const configPath = path.join(__dirname, 'data', 'config.json')
    const config = await fs.readFile(configPath, 'utf8')
    res.json(JSON.parse(config))
  } catch (error) {
    console.error('Error al leer la configuración:', error)
    res.status(500).json({ error: 'Error al cargar la configuración' })
  }
})

app.get('/api/sites', async (_, res) => {
  try {
    const sitesPath = path.join(__dirname, 'data', 'sites.json')
    const sites = await fs.readFile(sitesPath, 'utf8')
    res.json(JSON.parse(sites))
  } catch (error) {
    console.error('Error al leer los sitios:', error)
    res.status(500).json({ error: 'Error al cargar los sitios' })
  }
})

/**
 * Endpoint para verificar el estado de una URL.
 * Recibe una URL como query parameter 'url'.
 * Evita problemas de CORS al hacer la petición desde el backend.
 */
app.get('/check-status', async (req, res) => {
  const urlToCheck = req.query.url

  if (!urlToCheck) {
    return res.status(400).json({ status: 'error', message: 'URL no proporcionada' })
  }

  try {
    const response = await fetch(urlToCheck, { method: 'HEAD', timeout: 5000 })

    if (response.ok) {
      res.json({ status: 'online' })
    } else {
      res.json({ status: 'offline' })
    }
  } catch (error) {
    console.error(`Error checking ${urlToCheck}:`, error.message)
    res.json({ status: 'offline' })
  }
})

/**
 * Endpoint para obtener el favicon de Google
 */
app.get('/api/favicon/google', async (req, res) => {
  const url = req.query.url
  if (!url) {
    return res.status(400).json({ error: 'URL no proporcionada' })
  }

  try {
    const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url)}`
    const response = await fetch(googleFaviconUrl)
    
    if (!response.ok) {
      throw new Error('No se pudo obtener el favicon de Google')
    }

    // Forwarding the favicon with proper headers
    res.set('Content-Type', response.headers.get('content-type'))
    response.body.pipe(res)
  } catch (error) {
    console.error('Error al obtener favicon de Google:', error)
    res.status(500).json({ error: 'Error al obtener el favicon' })
  }
})

/**
 * Endpoint para obtener el favicon directamente del sitio
 */
app.get('/api/favicon/site', async (req, res) => {
  const url = req.query.url
  if (!url) {
    return res.status(400).json({ error: 'URL no proporcionada' })
  }

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('No se pudo acceder al sitio')
    }

    const text = await response.text()
    const matches = text.match(/<link[^>]*?rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*?>/gi)
    
    if (!matches) {
      throw new Error('No se encontró el favicon')
    }

    // Buscar la URL del favicon en los matches encontrados
    let faviconUrl = null
    for (const match of matches) {
      const hrefMatch = match.match(/href=["']([^"']+)["']/)
      if (hrefMatch) {
        faviconUrl = new URL(hrefMatch[1], url).href
        break
      }
    }

    if (!faviconUrl) {
      throw new Error('No se encontró la URL del favicon')
    }

    // Obtener y reenviar el favicon
    const faviconResponse = await fetch(faviconUrl)
    if (!faviconResponse.ok) {
      throw new Error('No se pudo obtener el favicon')
    }

    res.set('Content-Type', faviconResponse.headers.get('content-type'))
    faviconResponse.body.pipe(res)
  } catch (error) {
    console.error('Error al obtener favicon del sitio:', error)
    res.status(500).json({ error: 'Error al obtener el favicon' })
  }
})

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`)
})
