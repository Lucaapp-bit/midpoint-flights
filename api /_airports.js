import { AIRPORTS, getAirport } from "./_airports.js";
import { priceLeg, providerName } from "./_providers.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Usa POST." });
  }

  // Vercel parses JSON automatically, but guard for safety.
  const body =
    typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const {
    originA,
    originB,
    departDate,
    returnDate,
    nonStop = false,
    maxTotalBudget = null,
    limit = 12
  } = body;

  if (!originA || !originB || !departDate) {
    return res.status(400).json({ error: "Servono originA, originB e departDate." });
  }
  if (!getAirport(originA) || !getAirport(originB)) {
    return res.status(400).json({ error: "Aeroporto di partenza non valido." });
  }
  if (originA === originB) {
    return res.status(400).json({ error: "Le due città devono essere diverse." });
  }

  const destinations = AIRPORTS.filter(
    (a) => a.code !== originA && a.code !== originB
  ).map((a) => a.code);

  const provider = providerName();
  const CONCURRENCY = provider === "amadeus" ? 4 : 24;
  const results = [];
  let cursor = 0;

  const worker = async () => {
    while (cursor < destinations.length) {
      const dest = destinations[cursor++];
      const [fa, fb] = await Promise.all([
        priceLeg({ origin: originA, destination: dest, departDate, returnDate, nonStop }),
        priceLeg({ origin: originB, destination: dest, departDate, returnDate, nonStop })
      ]);
      if (!fa || !fb) continue;

      const total = fa.price + fb.price;
      if (maxTotalBudget && total > Number(maxTotalBudget)) continue;

      const airport = getAirport(dest);
      const diff = Math.abs(fa.price - fb.price);
      const fairness = total === 0 ? 1 : 1 - diff / total;

      results.push({
        destination: { code: dest, city: airport.city, country: airport.country },
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
}
