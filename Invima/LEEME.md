# Consulta INVIMA (PWA)

Archivos: index.html, manifest.json, sw.js, icon-192.png, icon-512.png, icon-maskable-512.png

## Publicar en GitHub Pages (HTTPS, necesario para cámara e instalación)
1. Crea un repositorio y sube estos 6 archivos en la raíz.
2. Settings > Pages > Deploy from a branch > main / (root).
3. Abre la URL https://<usuario>.github.io/<repo>/ en Chrome (Android).
4. Menú ⋮ > "Instalar aplicación" (o el botón "Instalar app" de la página).

## Notas
- La cámara y la instalación NO funcionan abriendo el .html local (file://); sí funciona la consulta manual.
- La primera vez que se usa el escáner se descarga el lector OCR (~10 MB); queda en caché para uso posterior.
- Si cambias archivos, sube la versión: en sw.js cambia VERSION = "v1" a "v2".
