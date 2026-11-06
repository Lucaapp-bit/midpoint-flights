const { getAirport, distanceKm, primaryAirports, itCity, itCountry } = require("./_airports.js");
const { priceLeg, providerName, isTestMode } = require("./_providers.js");

const MAX_ORIGINS = 6;
const REAL_CANDIDATES = 12; // cities priced with a live provider (each costs real API calls)
const REAL_DEADLINE_MS = 24000; // stay under the function limit and return what we have

// Rank every city as a meeting point by geography alone: close to both
// travelers, balanced between them, and well connected. Used to decide which
// few cities are worth a (slow, metered) real fare lookup.
function pickCandidates(destinations, codesA, codesB, n) {
  const A = codesA.map(getAirport);
  const B = codesB.map(getAirport);
  const near = (d, list) => Math.min(...list.map((o) => distanceKm(o, d)));
  const scored = destinations.map((d) => {
    const da = near(getAirport(d), A);
    const db = near(getAirport(d), B);
    const ap = getAirport(d);
    // average trip length, plus a penalty for lopsided trips, hub bonus
    const score = (da + db) / 2 + Math.abs(da - db) * 0.6 - (ap.hub ? 400 : 0);
    return { d, da, db, score };
  });
  return scored
    .filter((x) => x.da > 250 && x.db > 250)
    .sort((x, y) => x.score - y.score)
    .slice(0, n)
    .map((x) => x.d);
}

// Accepts "MXP" or ["MXP","LIN","BGY"]; returns a de-duplicated list of codes.
function toCodes(v) {
  const arr = Array.isArray(v) ? v : [v];
  return [...new Set(arr.filter(Boolean).map((c) => String(c).trim().toUpperCase()))];
}

// Cheapest fare among all the airports the traveler is willing to leave from.
async function cheapestLeg(origins, destination, opts) {
  const legs = await Promise.all(
    origins.map((origin) => priceLeg({ origin, destination, ...opts }))
  );
  let best = null;
  for (const l of legs) {
    if (l && (!best || l.price < best.price)) best = l;
  }
  return best;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Usa POST." });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch (e) {
    return res.status(400).json({ error: "Body JSON non valido." });
  }
  const {
    originA,
    originB,
    departDate,
    returnDate,
    nonStop = false,
    maxTotalBudget = null,
    limit = 12
  } = body;

  const codesA = toCodes(originA);
  const codesB = toCodes(originB);

  if (!codesA.length || !codesB.length || !departDate) {
    return res.status(400).json({ error: "Servono originA, originB e departDate." });
  }
  if (codesA.length > MAX_ORIGINS || codesB.length > MAX_ORIGINS) {
    return res.status(400).json({ error: "Troppi aeroporti di partenza." });
  }
  if (![...codesA, ...codesB].every((c) => getAirport(c))) {
    return res.status(400).json({ error: "Aeroporto di partenza non valido." });
  }

  const cityOf = (c) => getAirport(c).city;
  const citiesA = new Set(codesA.map(cityOf));
  const citiesB = new Set(codesB.map(cityOf));
  if ([...citiesA].some((c) => citiesB.has(c))) {
    return res.status(400).json({ error: "Le due città devono essere diverse." });
  }

  // One candidate destination per city (its primary airport), excluding the origin cities.
  const originCities = new Set([...citiesA, ...citiesB]);
  let destinations = primaryAirports()
    .filter((a) => !originCities.has(a.city))
    .map((a) => a.code);

  const provider = providerName();
  const real = provider !== "mock";
  const considered = destinations.length;
  if (real) destinations = pickCandidates(destinations, codesA, codesB, REAL_CANDIDATES);
  const CONCURRENCY = real ? 6 : 24;
  const startedAt = Date.now();
  let timedOut = false;
  const legOpts = { departDate, returnDate, nonStop };
  const results = [];
  let cursor = 0;

  const worker = async () => {
    while (cursor < destinations.length) {
      if (real && Date.now() - startedAt > REAL_DEADLINE_MS) { timedOut = true; return; }
      const dest = destinations[cursor++];
      const [fa, fb] = await Promise.all([
        cheapestLeg(codesA, dest, legOpts),
        cheapestLeg(codesB, dest, legOpts)
      ]);
      if (!fa || !fb) continue;

      const total = fa.price + fb.price;
      if (maxTotalBudget && total > Number(maxTotalBudget)) continue;

      const airport = getAirport(dest);
      const diff = Math.abs(fa.price - fb.price);
      const fairness = total === 0 ? 1 : 1 - diff / total;

      results.push({
        destination: { code: dest, city: itCity(airport.city), country: itCountry(airport.country) },
        travelerA: fa,
        travelerB: fb,
        total,
        currency: fa.currency,
        priceDiff: diff,
        fairness: Number(fairness.toFixed(2)),
        combinedDurationMinutes: (fa.durationMinutes || 0) + (fb.durationMinutes || 0),
        bothNonStop: fa.nonStop && fb.nonStop
      });
    }
  };

  try {
    await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  } catch (e) {
    return res.status(500).json({ error: "Errore nel calcolo dei prezzi." });
  }

  results.sort(
    (x, y) =>
      x.total - y.total ||
      y.fairness - x.fairness ||
      x.combinedDurationMinutes - y.combinedDurationMinutes
  );

  res.status(200).json({
    count: results.length,
    provider,
    real: real && !isTestMode(),
    searched: destinations.length,
    considered,
    partial: timedOut,
    results: results.slice(0, Number(limit))
  });
};
