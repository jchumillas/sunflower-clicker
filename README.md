# Sunflower Clicker

Videojuego clicker hecho con React, TypeScript, Vite y canvas.

## Desarrollo local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

La build de produccion se genera en `dist`.

## Despliegue en Vercel

Este proyecto incluye `vercel.json`, listo para desplegar como aplicacion Vite.

Configuracion esperada en Vercel:

- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

Para desplegar desde GitHub, importa el repositorio en Vercel y acepta la configuracion detectada.

Para desplegar con la CLI:

```bash
npm i -g vercel
vercel
```

Para publicar en produccion desde CLI:

```bash
vercel --prod
```
