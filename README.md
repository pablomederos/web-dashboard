# Dashboard de Sitios

Este proyecto es un dashboard web minimalista y moderno para monitorear el estado de múltiples sitios web. Muestra el favicon, nombre y un semáforo de estado para cada sitio listado.

## Características
- Visualización clara y responsiva de sitios web
- Semáforo de estado (online/offline) para cada sitio
- Favicon y nombre de cada sitio
- Diseño moderno, minimalista y adaptable a móviles
- Configuración mediante archivos JSON externos
- Actualización en tiempo real de la configuración

## Estructura del Proyecto

```
/
├── data/           # Carpeta de configuración externa (opcional)
│   ├── config.json # Configuración general del sitio
│   └── sites.json  # Lista de sitios a monitorear
├── src/
│   ├── data/      # Configuración por defecto
│   ├── public/    # Archivos estáticos
│   └── server.js  # Servidor Express
└── compose.yml    # Configuración de Docker
```

## Configuración

El dashboard requiere dos archivos de configuración que pueden estar ubicados en la carpeta `src/data/` (por defecto) o en una carpeta externa:

### 1. Configuración del Sitio (`config.json`)

Este archivo contiene la configuración general del dashboard:

```json
{
  "site": {
    "title": "Dashboard de Sitios",
    "footer": {
      "copyright": "© 2025",
      "author": "Tu Nombre",
      "links": [
        {
          "text": "Nombre del Enlace",
          "url": "https://ejemplo.com"
        }
      ]
    }
  }
}
```

### 2. Configuración de Sitios Monitoreados (`sites.json`)

Este archivo contiene la lista de sitios a monitorear:

```json
[
  {
    "name": "Nombre del sitio",
    "url": "https://ejemplo.com"
  },
  {
    "name": "Otro sitio",
    "url": "https://otro.com"
  }
]
```

Puedes modificar ambos archivos según tus necesidades. Los cambios se reflejan automáticamente en el dashboard.

## Despliegue con Docker Compose

El proyecto puede desplegarse de dos formas:

### 1. Usando la configuración por defecto

1. **Construir y levantar el servicio:**
   ```bash
   sudo docker compose up -d --build
   ```

2. **Acceder al dashboard:**
   - Abre tu navegador en [http://localhost:8080](http://localhost:8080)
   - El sitio usará la configuración ubicada en `src/data/`

### 2. Usando configuración externa (recomendado)

1. **Crear estructura de configuración:**
   ```bash
   # Crear directorio de datos
   mkdir -p data
   
   # Crear archivos de configuración vacíos
   echo '{"site":{"title":"Dashboard de Sitios","footer":{"copyright":"© 2025","author":"","links":[]}}}' > data/config.json
   echo '[]' > data/sites.json
   ```

2. **Modificar el `compose.yml`:**
   ```yaml
   services:
     web-dashboard:
       build: .
       container_name: dashboard_app
       ports:
         - "8080:3000"
       restart: unless-stopped
       volumes:
         - ./data:/app/src/data:rw  # Monta la configuración externa
   ```

3. **Configurar el dashboard:**
   - Edita `data/config.json` con la configuración del sitio
   - Edita `data/sites.json` con la lista de sitios a monitorear
   - Los archivos deben existir aunque estén vacíos

4. **Construir y levantar el servicio:**
   ```bash
   sudo docker compose up -d --build
   ```

5. **Acceder al dashboard:**
   - Abre tu navegador en [http://localhost:8080](http://localhost:8080)
   - Los cambios en los archivos de configuración se reflejan en tiempo real

## Notas importantes

- Si se configura el `compose.yml` para usar configuración externa, los archivos deben existir con un contenido válido.
- Si no se monta un volumen externo, se usará la configuración por defecto en `src/data/`
- Los cambios en los archivos de configuración se aplican automáticamente sin reiniciar el contenedor
- Se recomienda usar configuración externa para mantener la configuración al actualizar la imagen
- La validación de las URLs se hace en el servidor para mantener la consistencia ente los clientes

---

© 2025 Pablo Gabriel Mederos · La Cueva DEV · La Cueva del Insecto
