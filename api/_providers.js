const { getAirport, distanceKm } = require("./_airports.js");
const { duffelPrice } = require("./_duffel.js");

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

// FLIGHT_PROVIDER picks one explicitly; otherwise whichever token is present
// (Travelpayouts first: it covers the whole world in one call per origin).
function providerName() {
  const kind = (process.env.FLIGHT_PROVIDER || "").toLowerCase();
  const tp = !!process.env.TRAVELPAYOUTS_TOKEN, df = !!process.env.DUFFEL_TOKEN;
  if (kind === "mock") return "mock";
  if (kind === "duffel" && df) return "duffel";
  if (kind === "travelpayouts" && tp) return "travelpayouts";
  if (!kind && tp) return "travelpayouts";
  if (!kind && df) return "duffel";
  return "mock";
}

// Duffel test tokens return synthetic offers, not real fares.
function isTestMode() {
  return providerName() === "duffel" && /^duffel_test/.test(process.env.DUFFEL_TOKEN || "");
}

async function priceLeg(args) {
  if (providerName() === "duffel") return duffelPrice(args);
  return mockPrice(args);
}

module.exports = { providerName, isTestMode, priceLeg };
