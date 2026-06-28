# Quiniela Mundial 2026

App de quiniela (pool de predicciones) para la fase eliminatoria del Mundial 2026. Cada jugador registra sus pronósticos, elige un campeón y exporta un código para enviárselo al organizador. El organizador importa los códigos, captura resultados oficiales y el bracket/ranking se calculan automáticamente. Sin backend: todo vive en `localStorage`, el intercambio se hace con códigos `QM26.<base64>`.

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Stack: React + TypeScript + Vite.
