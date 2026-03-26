# Dicotomía de Control 🍃

> "Si no depende de ti, suéltalo. Si depende de ti, agéndalo."

Una PWA minimalista para transformar cualquier preocupación en claridad inmediata.

---

## 🚀 Deploy en GitHub Pages (5 minutos)

1. Crea un repositorio en GitHub (puede ser público o privado con GitHub Pro)
2. Sube todos estos archivos al repositorio:
   ```
   index.html
   styles.css
   app.js
   manifest.json
   service-worker.js
   icons/icon-192.png
   icons/icon-512.png
   ```
3. Ve a **Settings → Pages → Source → Deploy from branch → main → / (root)**
4. En ~2 minutos tu app estará en: `https://TU_USUARIO.github.io/NOMBRE_REPO/`

---

## 📱 Añadir a pantalla de inicio en iPhone (Safari)

1. Abre la URL de tu app en **Safari** (no Chrome)
2. Pulsa el botón de compartir (cuadrado con flecha ↑)
3. Desplázate y pulsa **"Añadir a pantalla de inicio"**
4. Pon el nombre que quieras y pulsa **Añadir**

La app aparecerá como icono nativo en tu pantalla de inicio y funcionará sin barra de Safari.

---

## ✨ Características

- **Offline-first**: funciona sin conexión gracias al Service Worker
- **PWA instalable**: manifest.json configurado para iOS y Android
- **Historial local**: todo guardado en localStorage (sin backend, sin cuenta)
- **Exportar a calendario**: genera un archivo .ics compatible con Calendario de iPhone
- **Cero dependencias**: HTML + CSS + JS vanilla puro

---

## 📁 Estructura de archivos

```
/
├── index.html          ← Toda la UI (pantallas)
├── styles.css          ← Diseño minimalista estilo Apple
├── app.js              ← Lógica y navegación
├── manifest.json       ← Configuración PWA
├── service-worker.js   ← Cache offline
└── icons/
    ├── icon-192.png    ← Icono para Android/Chrome
    └── icon-512.png    ← Icono para splash screen
```

---

## 🧠 Flujo de la app

```
¿Qué te preocupa?
       ↓
¿Depende de ti?
   ↙         ↘
  NO          SÍ
  ↓            ↓
Soltar    ¿Acción inmediata?
  ↓            ↓
Guardado   Fecha + Hora → .ics
  ↓            ↓
       Historial
```
