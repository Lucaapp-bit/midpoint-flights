// Curated airport list shared by the API. Coordinates power mock pricing;
// `hub` weights an airport toward cheaper fares (more competition).
export const AIRPORTS = [
  { code: "LHR", city: "London", country: "UK", lat: 51.47, lon: -0.4543, hub: true },
  { code: "CDG", city: "Paris", country: "France", lat: 49.0097, lon: 2.5479, hub: true },
  { code: "AMS", city: "Amsterdam", country: "Netherlands", lat: 52.3105, lon: 4.7683, hub: true },
  { code: "FRA", city: "Frankfurt", country: "Germany", lat: 50.0379, lon: 8.5622, hub: true },
  { code: "MAD", city: "Madrid", country: "Spain", lat: 40.4936, lon: -3.5668, hub: true },
  { code: "BCN", city: "Barcelona", country: "Spain", lat: 41.2974, lon: 2.0833, hub: true },
  { code: "FCO", city: "Rome", country: "Italy", lat: 41.8003, lon: 12.2389, hub: true },
  { code: "MXP", city: "Milan", country: "Italy", lat: 45.6306, lon: 8.7281, hub: true },
  { code: "MUC", city: "Munich", country: "Germany", lat: 48.3538, lon: 11.7861, hub: true },
  { code: "BER", city: "Berlin", country: "Germany", lat: 52.3667, lon: 13.5033, hub: true },
  { code: "VIE", city: "Vienna", country: "Austria", lat: 48.1103, lon: 16.5697, hub: true },
  { code: "ZRH", city: "Zurich", country: "Switzerland", lat: 47.4647, lon: 8.5492, hub: false },
  { code: "LIS", city: "Lisbon", country: "Portugal", lat: 38.7742, lon: -9.1342, hub: true },
  { code: "OPO", city: "Porto", country: "Portugal", lat: 41.2481, lon: -8.6814, hub: false },
  { code: "DUB", city: "Dublin", country: "Ireland", lat: 53.4213, lon: -6.2701, hub: true },
  { code: "CPH", city: "Copenhagen", country: "Denmark", lat: 55.618, lon: 12.6508, hub: true },
  { code: "ARN", city: "Stockholm", country: "Sweden", lat: 59.6519, lon: 17.9186, hub: false },
  { code: "OSL", city: "Oslo", country: "Norway", lat: 60.1939, lon: 11.1004, hub: false },
  { code: "HEL", city: "Helsinki", country: "Finland", lat: 60.3172, lon: 24.9633, hub: false },
  { code: "PRG", city: "Prague", country: "Czechia", lat: 50.1008, lon: 14.26, hub: true },
  { code: "BUD", city: "Budapest", country: "Hungary", lat: 47.4369, lon: 19.2556, hub: true },
  { code: "WAW", city: "Warsaw", country: "Poland", lat: 52.1657, lon: 20.9671, hub: true },
  { code: "KRK", city: "Krakow", country: "Poland", lat: 50.0777, lon: 19.7848, hub: false },
  { code: "ATH", city: "Athens", country: "Greece", lat: 37.9364, lon: 23.9445, hub: true },
  { code: "IST", city: "Istanbul", country: "Turkey", lat: 41.2753, lon: 28.7519, hub: true },
  { code: "SAW", city: "Istanbul (Sabiha)", country: "Turkey", lat: 40.8986, lon: 29.3092, hub: true },
  { code: "BRU", city: "Brussels", country: "Belgium", lat: 50.9014, lon: 4.4844, hub: true },
  { code: "GVA", city: "Geneva", country: "Switzerland", lat: 46.2381, lon: 6.109, hub: false },
  { code: "EDI", city: "Edinburgh", country: "UK", lat: 55.95, lon: -3.3725, hub: false },
  { code: "MAN", city: "Manchester", country: "UK", lat: 53.3537, lon: -2.275, hub: true },
  { code: "NAP", city: "Naples", country: "Italy", lat: 40.886, lon: 14.2908, hub: false },
  { code: "VCE", city: "Venice", country: "Italy", lat: 45.5053, lon: 12.3519, hub: false },
  { code: "SVQ", city: "Seville", country: "Spain", lat: 37.418, lon: -5.8931, hub: false },
  { code: "VLC", city: "Valencia", country: "Spain", lat: 39.4893, lon: -0.4816, hub: false },
  { code: "PMI", city: "Palma de Mallorca", country: "Spain", lat: 39.5517, lon: 2.7388, hub: false },
  { code: "NCE", city: "Nice", country: "France", lat: 43.6584, lon: 7.2159, hub: false },
  { code: "LYS", city: "Lyon", country: "France", lat: 45.7256, lon: 5.0811, hub: false },
  { code: "HAM", city: "Hamburg", country: "Germany", lat: 53.6304, lon: 9.9882, hub: false },
  { code: "DUS", city: "Dusseldorf", country: "Germany", lat: 51.2895, lon: 6.7668, hub: true },
  { code: "GDN", city: "Gdansk", country: "Poland", lat: 54.3776, lon: 18.4662, hub: false },
  { code: "RIX", city: "Riga", country: "Latvia", lat: 56.9236, lon: 23.9711, hub: false },
  { code: "TLL", city: "Tallinn", country: "Estonia", lat: 59.4133, lon: 24.8328, hub: false },
  { code: "SOF", city: "Sofia", country: "Bulgaria", lat: 42.6952, lon: 23.4062, hub: false },
  { code: "OTP", city: "Bucharest", country: "Romania", lat: 44.5711, lon: 26.085, hub: true },
  { code: "ZAG", city: "Zagreb", country: "Croatia", lat: 45.7429, lon: 16.0688, hub: false },
  { code: "SPU", city: "Split", country: "Croatia", lat: 43.5389, lon: 16.2981, hub: false },
  { code: "TIA", city: "Tirana", country: "Albania", lat: 41.4147, lon: 19.7206, hub: false },
  { code: "MLA", city: "Malta", country: "Malta", lat: 35.8575, lon: 14.4775, hub: false },
  { code: "KEF", city: "Reykjavik", country: "Iceland", lat: 63.985, lon: -22.6056, hub: false }
];

const byCode = new Map(AIRPORTS.map((a) => [a.code, a]));
export const getAirport = (code) => byCode.get(code);

export function distanceKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function searchAirports(q, limit = 8) {
  const s = (q || "").trim().toLowerCase();
  if (!s) return [];
  return AIRPORTS.filter(
    (a) =>
      a.city.toLowerCase().includes(s) ||
      a.country.toLowerCase().includes(s) ||
      a.code.toLowerCase() === s
  ).slice(0, limit);
}
