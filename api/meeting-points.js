const { getAirport, primaryAirports, itCity, itCountry } = require("./_airports.js");
const { priceLeg, providerName } = require("./_providers.js");

const MAX_ORIGINS = 6;

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
  const destinations = primaryAirports()
    .filter((a) => !originCities.has(a.city))
    .map((a) => a.code);

  const provider = providerName();
  const CONCURRENCY = provider === "duffel" ? 4 : 24;
  const legOpts = { departDate, returnDate, nonStop };
  const results = [];
  let cursor = 0;

  const worker = async () => {
    while (cursor < destinations.length) {
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
    results: results.slice(0, Number(limit))
  });
};
