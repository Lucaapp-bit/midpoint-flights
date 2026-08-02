import { getAirport, distanceKm } from "./_airports.js";

// --- Mock provider: deterministic, distance-based realistic pricing ---
function seededRand(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  return ((h >>> 0) % 100000) / 100000;
}

function mockPrice({ origin, destination, departDate, returnDate, nonStop }) {
  const a = getAirport(origin);
  const b = getAirport(destination);
  if (!a || !b || origin === destination) return null;
  const km = distanceKm(a, b);
  if (km < 150) return null;

  const seed = `${origin}-${destination}-${departDate}-${returnDate || "ow"}`;
  const r = seededRand(seed);
  const perKm = a.hub && b.hub ? 0.055 : a.hub || b.hub ? 0.075 : 0.095;
  let base = 28 + km * perKm;
  if (returnDate) base *= 1.8;
  base *= 0.65 + r * 0.7;
  const dow = new Date(departDate).getUTCDay();
  if (dow === 5 || dow === 6) base *= 1.12;

  const likelyDirect = km < 2500 && (a.hub || b.hub);
  if (nonStop && !likelyDirect) {
    if (r < 0.5) return null;
    base *= 1.25;
  }
  const durationMinutes = Math.round(45 + km / 12 + (nonStop ? 0 : 70 * r));
  return {
    price: Math.round(base),
    currency: "EUR",
    nonStop: nonStop ? true : likelyDirect && r > 0.4,
    durationMinutes,
    origin,
    destination
  };
}

// --- Amadeus provider: real fares via Self-Service API ---
let tokenCache = { token: null, expiry: 0 };

async function amadeusToken() {
  if (tokenCache.token && Date.now() < tokenCache.expiry - 30000) {
    return tokenCache.token;
  }
  const host = process.env.AMADEUS_HOST || "https://test.api.amadeus.com";
  const res = await fetch(`${host}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_CLIENT_ID,
      client_secret: process.env.AMADEUS_CLIENT_SECRET
    })
  });
  if (!res.ok) throw new Error(`Amadeus auth failed: ${res.status}`);
  const data = await res.json();
  tokenCache = {
    token: data.access_token,
    expiry: Date.now() + data.expires_in * 1000
  };
  return tokenCache.token;
}

function isoMinutes(iso) {
  if (!iso) return null;
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?/.exec(iso);
  if (!m) return null;
  return parseInt(m[1] || 0) * 60 + parseInt(m[2] || 0);
}

async function amadeusPrice({ origin, destination, departDate, returnDate, nonStop }) {
  if (origin === destination) return null;
  const host = process.env.AMADEUS_HOST || "https://test.api.amadeus.com";
  try {
    const token = await amadeusToken();
    const params = new URLSearchParams({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departDate,
      adults: "1",
      currencyCode: "EUR",
      max: "5"
    });
    if (returnDate) params.set("returnDate", returnDate);
    if (nonStop) params.set("nonStop", "true");

    const res = await fetch(
      `${host}/v2/shopping/flight-offers?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const offers = data.data || [];
    let best = null;
    for (const o of offers) {
      const price = parseFloat(o.price?.grandTotal ?? o.price?.total);
      if (!Number.isFinite(price)) continue;
      if (!best || price < best.price) {
        const seg = o.itineraries?.[0]?.segments || [];
        best = {
          price,
          currency: o.price?.currency || "EUR",
          nonStop: seg.length <= 1,
          durationMinutes: isoMinutes(o.itineraries?.[0]?.duration),
          origin,
          destination
        };
      }
    }
    if (best) best.price = Math.round(best.price);
    return best;
  } catch (e) {
    console.error("[amadeus]", e.message);
    return null;
  }
}

// --- Selector ---
export function providerName() {
  const kind = (process.env.FLIGHT_PROVIDER || "mock").toLowerCase();
  if (kind === "amadeus" && process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET) {
    return "amadeus";
  }
  return "mock";
}

export async function priceLeg(args) {
  return providerName() === "amadeus" ? amadeusPrice(args) : mockPrice(args);
}
