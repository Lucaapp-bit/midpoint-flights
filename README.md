# MidPoint Flights

Trova la città "punto d'incontro" più economica per due viaggiatori.
Frontend statico (`index.html`) + funzioni serverless Vercel in `api/`.

## Dati voli
- Default: provider `mock` (prezzi deterministici basati sulla distanza).
- Dati reali (consigliato): imposta su Vercel `TRAVELPAYOUTS_TOKEN` (gratuito, travelpayouts.com → Tools → Data API).
  Una chiamata per aeroporto di partenza restituisce i prezzi più bassi visti di recente verso tutto il mondo
  (dati in cache di Aviasales, non quotazioni live). Se manca il giorno esatto, allarga al mese.
- Alternativa: imposta su Vercel `FLIGHT_PROVIDER=duffel` e `DUFFEL_TOKEN=<token Duffel>`.
  Un token `duffel_test_...` restituisce offerte sintetiche (il sito lo segnala); servono un account
  Duffel attivato e un token `duffel_live_...` per tariffe vere.
- Destinazioni: ~280 città nel mondo (`api/_airports.js` + `api/_world.js`). Con un provider reale
  si interrogano solo le 12 città geograficamente più adatte (limite di tempo 24 s), con il mock tutte.

## Test locale
```
npx vercel dev
```
