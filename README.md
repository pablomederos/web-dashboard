# Dashboard de Sitios

Este proyecto es un dashboard web minimalista y moderno para monitorear el estado de múltiples sitios web. Muestra el favicon, nombre y un semáforo de estado para cada sitio listado en un archivo `sites.json` editable.

## Características
- Visualización clara y responsiva de sitios web.
- Semáforo de estado (online/offline) para cada sitio.
- Favicon y nombre de cada sitio.
- Diseño moderno, minimalista y adaptable a móviles.
- Edición en vivo del archivo `sites.json` gracias a un volumen Docker.

## Configuración del archivo `sites.json`

El archivo `sites.json` se encuentra en `src/public/data/sites.json` y debe tener el siguiente formato:

```
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

Puedes agregar, quitar o modificar los sitios según tus necesidades. Los cambios se reflejan automáticamente en el dashboard.

## Uso con Docker Compose

El proyecto incluye un archivo `compose.yml` para facilitar el despliegue con Docker. El servicio expone el dashboard en el puerto 8080 del host y monta el archivo `sites.json` como volumen para edición en vivo.

### Comandos básicos

1. **Construir y levantar el servicio:**
   ```bash
   sudo docker compose up -d --build
   ```

2. **Acceder al dashboard:**
   Abre tu navegador en [http://localhost:8080](http://localhost:8080)

3. **Editar los sitios:**
   Edita el archivo `src/public/data/sites.json` en tu máquina local. Los cambios se reflejan automáticamente en el dashboard.


### Ejemplo de sección de volumen en `compose.yml`:

```
services:
  web-dashboard:
    build: .
    container_name: dashboard_app
    ports:
      - "8080:3000"
    restart: always
    volumes:
      - ./data:/app/src/public/data
```

Así puedes editar el archivo `sites.json` (y cualquier otro archivo de ese folder) desde fuera del contenedor y ver los cambios en tiempo real.

---

© 2025 Pablo Gabriel Mederos · La Cueva DEV · La Cueva del Insecto
