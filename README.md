# MidPoint Flights

Trova la città "punto d'incontro" più economica per due viaggiatori.
Frontend statico (`index.html`) + funzioni serverless Vercel in `api/`.

## Dati voli
- Default: provider `mock` (prezzi deterministici basati sulla distanza).
- Dati reali: imposta su Vercel `FLIGHT_PROVIDER=duffel` e `DUFFEL_TOKEN=<token Duffel>`.

## Test locale
```
npx vercel dev
```
