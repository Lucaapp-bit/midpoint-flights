// Travelpayouts / Aviasales Data API — real fares seen on Aviasales in the last
// days (cached, not a live quote). One request per origin airport returns the
// cheapest fare to EVERY destination, so it scales to the whole world.
// Env: TRAVELPAYOUTS_TOKEN (free, from travelpayouts.com)
const HOST = "https://api.travelpayouts.com";

// Aviasales answers with city codes for multi-airport cities; map them to the
// city names used in _airports.js. Single-airport cities use the airport code.
const CITY_CODES = {
  LON: "London", PAR: "Paris", MIL: "Milan", ROM: "Rome", NYC: "New York",
  TYO: "Tokyo", OSA: "Osaka", SAO: "Sao Paulo", RIO: "Rio de Janeiro",
  WAS: "Washington", BUE: "Buenos Aires", STO: "Stockholm", BJS: "Beijing",
  SEL: "Seoul", SHA: "Shanghai", BKK: "Bangkok", CHI: "Chicago", DFW: "Dallas",
  HOU: "Houston", IST: "Istanbul", BER: "Berlin", MOW: "Moscow", JKT: "Jakarta",
  YTO: "Toronto", YMQ: "Montreal", DXB: "Dubai", SPK: "Sapporo", NGO: "Nagoya"
};

async function farePage(token, { origin, departDate, returnDate, nonStop }) {
  const p = new URLSearchParams({
    origin, departure_at: departDate, unique: "true", sorting: "price",
    currency: "eur", limit: "1000", one_way: returnDate ? "false" : "true",
    direct: nonStop ? "true" : "false"
  });
  if (returnDate) p.set("return_at", returnDate);
  const res = await fetch(`${HOST}/aviasales/v3/prices_for_dates?${p}`, {
    headers: { "X-Access-Token": token, Accept: "application/json" },
    signal: AbortSignal.timeout(15000)
  });
  if (!res.ok) throw new Error(`travelpayouts ${res.status}`);
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

// -> Map(destination IATA code as returned) -> leg, cheapest per destination.
async function farePerDestination(origins, opts) {
  const token = process.env.TRAVELPAYOUTS_TOKEN;
  const out = new Map();
  if (!token) return out;
  const pages = await Promise.all(
    origins.map((origin) =>
      farePage(token, { ...opts, origin }).then((rows) => ({ origin, rows })).catch((e) => {
        console.error("[travelpayouts]", e.message);
        return { origin, rows: [] };
      })
    )
  );
  for (const { origin, rows } of pages) {
    for (const r of rows) {
      const price = Number(r.price);
      const dest = r.destination;
      if (!dest || !Number.isFinite(price) || r.origin_airport === r.destination_airport) continue;
      const cur = out.get(dest);
      if (cur && cur.price <= price) continue;
      out.set(dest, {
        price: Math.round(price),
        currency: "EUR",
        nonStop: Number(r.transfers || 0) === 0,
        durationMinutes: Number(r.duration_to || r.duration) || null,
        origin: r.origin_airport || origin,
        destination: r.destination_airport || dest,
        link: r.link ? `https://www.aviasales.com${r.link}` : null
      });
    }
  }
  return out;
}

module.exports = { farePerDestination, CITY_CODES };
