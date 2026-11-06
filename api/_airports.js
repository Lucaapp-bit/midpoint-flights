// Curated airport list shared by the API. Coordinates power mock pricing;
// `hub` weights an airport toward cheaper fares (more competition).
// Several airports can share the same `city` (e.g. Milan: MXP, LIN, BGY):
// searching by city returns a group option covering all of them.

// [code, city, country, lat, lon, hub, name]
const ROWS = [
  ["LHR", "London", "UK", 51.47, -0.4543, 1, "Heathrow"],
  ["LGW", "London", "UK", 51.1537, -0.1821, 1, "Gatwick"],
  ["STN", "London", "UK", 51.885, 0.235, 0, "Stansted"],
  ["LTN", "London", "UK", 51.8747, -0.3683, 0, "Luton"],
  ["LCY", "London", "UK", 51.5053, 0.0553, 0, "City"],
  ["CDG", "Paris", "France", 49.0097, 2.5479, 1, "Charles de Gaulle"],
  ["ORY", "Paris", "France", 48.7233, 2.3794, 1, "Orly"],
  ["AMS", "Amsterdam", "Netherlands", 52.3105, 4.7683, 1, "Schiphol"],
  ["FRA", "Frankfurt", "Germany", 50.0379, 8.5622, 1, "Rhein-Main"],
  ["HHN", "Frankfurt", "Germany", 49.9487, 7.2639, 0, "Hahn"],
  ["MAD", "Madrid", "Spain", 40.4936, -3.5668, 1, "Barajas"],
  ["BCN", "Barcelona", "Spain", 41.2974, 2.0833, 1, "El Prat"],
  ["FCO", "Rome", "Italy", 41.8003, 12.2389, 1, "Fiumicino"],
  ["CIA", "Rome", "Italy", 41.7994, 12.5949, 0, "Ciampino"],
  ["MXP", "Milan", "Italy", 45.6306, 8.7281, 1, "Malpensa"],
  ["LIN", "Milan", "Italy", 45.4451, 9.2767, 0, "Linate"],
  ["BGY", "Milan", "Italy", 45.6739, 9.7042, 0, "Bergamo Orio al Serio"],
  ["MUC", "Munich", "Germany", 48.3538, 11.7861, 1, "Munich"],
  ["BER", "Berlin", "Germany", 52.3667, 13.5033, 1, "Brandenburg"],
  ["VIE", "Vienna", "Austria", 48.1103, 16.5697, 1, "Schwechat"],
  ["ZRH", "Zurich", "Switzerland", 47.4647, 8.5492, 0, "Zurich"],
  ["LIS", "Lisbon", "Portugal", 38.7742, -9.1342, 1, "Humberto Delgado"],
  ["OPO", "Porto", "Portugal", 41.2481, -8.6814, 0, "Francisco Sá Carneiro"],
  ["FAO", "Faro", "Portugal", 37.0144, -7.9659, 0, "Faro"],
  ["DUB", "Dublin", "Ireland", 53.4213, -6.2701, 1, "Dublin"],
  ["CPH", "Copenhagen", "Denmark", 55.618, 12.6508, 1, "Kastrup"],
  ["ARN", "Stockholm", "Sweden", 59.6519, 17.9186, 0, "Arlanda"],
  ["GOT", "Gothenburg", "Sweden", 57.6628, 12.2798, 0, "Landvetter"],
  ["OSL", "Oslo", "Norway", 60.1939, 11.1004, 0, "Gardermoen"],
  ["BGO", "Bergen", "Norway", 60.2934, 5.2181, 0, "Flesland"],
  ["HEL", "Helsinki", "Finland", 60.3172, 24.9633, 0, "Vantaa"],
  ["PRG", "Prague", "Czechia", 50.1008, 14.26, 1, "Václav Havel"],
  ["BUD", "Budapest", "Hungary", 47.4369, 19.2556, 1, "Ferenc Liszt"],
  ["WAW", "Warsaw", "Poland", 52.1657, 20.9671, 1, "Chopin"],
  ["WMI", "Warsaw", "Poland", 52.4511, 20.6518, 0, "Modlin"],
  ["KRK", "Krakow", "Poland", 50.0777, 19.7848, 0, "Balice"],
  ["GDN", "Gdansk", "Poland", 54.3776, 18.4662, 0, "Lech Wałęsa"],
  ["ATH", "Athens", "Greece", 37.9364, 23.9445, 1, "Eleftherios Venizelos"],
  ["SKG", "Thessaloniki", "Greece", 40.5197, 22.9709, 0, "Makedonia"],
  ["IST", "Istanbul", "Turkey", 41.2753, 28.7519, 1, "Istanbul Airport"],
  ["SAW", "Istanbul", "Turkey", 40.8986, 29.3092, 1, "Sabiha Gökçen"],
  ["AYT", "Antalya", "Turkey", 36.8987, 30.8005, 0, "Antalya"],
  ["ADB", "Izmir", "Turkey", 38.2924, 27.157, 0, "Adnan Menderes"],
  ["BRU", "Brussels", "Belgium", 50.9014, 4.4844, 1, "Zaventem"],
  ["CRL", "Brussels", "Belgium", 50.4592, 4.4538, 0, "Charleroi"],
  ["GVA", "Geneva", "Switzerland", 46.2381, 6.109, 0, "Geneva"],
  ["EDI", "Edinburgh", "UK", 55.95, -3.3725, 0, "Edinburgh"],
  ["MAN", "Manchester", "UK", 53.3537, -2.275, 1, "Manchester"],
  ["NAP", "Naples", "Italy", 40.886, 14.2908, 0, "Capodichino"],
  ["VCE", "Venice", "Italy", 45.5053, 12.3519, 0, "Marco Polo"],
  ["TSF", "Venice", "Italy", 45.6484, 12.1944, 0, "Treviso"],
  ["BLQ", "Bologna", "Italy", 44.5354, 11.2887, 0, "Guglielmo Marconi"],
  ["PSA", "Pisa", "Italy", 43.6839, 10.3927, 0, "Galileo Galilei"],
  ["FLR", "Florence", "Italy", 43.81, 11.2051, 0, "Peretola"],
  ["TRN", "Turin", "Italy", 45.2008, 7.6496, 0, "Caselle"],
  ["VRN", "Verona", "Italy", 45.3957, 10.8885, 0, "Villafranca"],
  ["BRI", "Bari", "Italy", 41.1389, 16.7606, 0, "Karol Wojtyła"],
  ["CTA", "Catania", "Italy", 37.4668, 15.0664, 0, "Fontanarossa"],
  ["PMO", "Palermo", "Italy", 38.176, 13.091, 0, "Falcone-Borsellino"],
  ["SVQ", "Seville", "Spain", 37.418, -5.8931, 0, "San Pablo"],
  ["VLC", "Valencia", "Spain", 39.4893, -0.4816, 0, "Valencia"],
  ["AGP", "Malaga", "Spain", 36.6749, -4.4991, 0, "Costa del Sol"],
  ["ALC", "Alicante", "Spain", 38.2822, -0.5582, 0, "Alicante-Elche"],
  ["BIO", "Bilbao", "Spain", 43.3011, -2.9106, 0, "Bilbao"],
  ["IBZ", "Ibiza", "Spain", 38.8729, 1.3731, 0, "Ibiza"],
  ["PMI", "Palma de Mallorca", "Spain", 39.5517, 2.7388, 0, "Son Sant Joan"],
  ["NCE", "Nice", "France", 43.6584, 7.2159, 0, "Côte d'Azur"],
  ["LYS", "Lyon", "France", 45.7256, 5.0811, 0, "Saint-Exupéry"],
  ["MRS", "Marseille", "France", 43.4393, 5.2214, 0, "Provence"],
  ["TLS", "Toulouse", "France", 43.6291, 1.3638, 0, "Blagnac"],
  ["HAM", "Hamburg", "Germany", 53.6304, 9.9882, 0, "Hamburg"],
  ["DUS", "Dusseldorf", "Germany", 51.2895, 6.7668, 1, "Dusseldorf"],
  ["CGN", "Cologne", "Germany", 50.8659, 7.1427, 0, "Cologne Bonn"],
  ["STR", "Stuttgart", "Germany", 48.6899, 9.222, 0, "Stuttgart"],
  ["RIX", "Riga", "Latvia", 56.9236, 23.9711, 0, "Riga"],
  ["TLL", "Tallinn", "Estonia", 59.4133, 24.8328, 0, "Lennart Meri"],
  ["VNO", "Vilnius", "Lithuania", 54.6341, 25.2858, 0, "Vilnius"],
  ["SOF", "Sofia", "Bulgaria", 42.6952, 23.4062, 0, "Sofia"],
  ["OTP", "Bucharest", "Romania", 44.5711, 26.085, 1, "Henri Coandă"],
  ["BEG", "Belgrade", "Serbia", 44.8184, 20.3091, 0, "Nikola Tesla"],
  ["ZAG", "Zagreb", "Croatia", 45.7429, 16.0688, 0, "Franjo Tuđman"],
  ["SPU", "Split", "Croatia", 43.5389, 16.2981, 0, "Split"],
  ["DBV", "Dubrovnik", "Croatia", 42.5614, 18.2682, 0, "Dubrovnik"],
  ["LJU", "Ljubljana", "Slovenia", 46.2237, 14.4576, 0, "Jože Pučnik"],
  ["BTS", "Bratislava", "Slovakia", 48.1702, 17.2127, 0, "M. R. Štefánik"],
  ["TIA", "Tirana", "Albania", 41.4147, 19.7206, 0, "Rinas"],
  ["MLA", "Malta", "Malta", 35.8575, 14.4775, 0, "Luqa"],
  ["LCA", "Larnaca", "Cyprus", 34.8751, 33.6249, 0, "Larnaca"],
  ["KEF", "Reykjavik", "Iceland", 63.985, -22.6056, 0, "Keflavík"]
];

// Italian / local spellings so "Milano", "Londra", "Monaco" … are found.
const CITY_ALIASES = {
  London: ["londra"], Paris: ["parigi"], Milan: ["milano"], Rome: ["roma"],
  Venice: ["venezia"], Naples: ["napoli"], Florence: ["firenze"], Turin: ["torino"],
  Munich: ["monaco", "monaco di baviera", "muenchen"], Vienna: ["wien"],
  Prague: ["praga"], Athens: ["atene"], Lisbon: ["lisbona"], Berlin: ["berlino"],
  Copenhagen: ["copenaghen"], Warsaw: ["varsavia"], Krakow: ["cracovia"],
  Brussels: ["bruxelles", "bruselas"], Geneva: ["ginevra"], Zurich: ["zurigo"],
  Seville: ["siviglia", "sevilla"], "Palma de Mallorca": ["maiorca", "majorca", "mallorca", "palma"],
  Nice: ["nizza"], Lyon: ["lione"], Hamburg: ["amburgo"], Cologne: ["colonia", "koln"],
  Bucharest: ["bucarest"], Marseille: ["marsiglia"], Belgrade: ["belgrado"],
  Edinburgh: ["edimburgo"], Dublin: ["dublino"], Stockholm: ["stoccolma"],
  Frankfurt: ["francoforte"], Gdansk: ["danzica"], Zagreb: ["zagabria"],
  Dubrovnik: ["ragusa"], Thessaloniki: ["salonicco"], Ljubljana: ["lubiana"],
  Izmir: ["smirne"], Malaga: ["malaga"], Malta: ["la valletta", "valletta"],
  Gothenburg: ["goteborg", "gotemburgo"], Toulouse: ["tolosa"], Valencia: ["valenza"],
  Tallinn: ["tallin"], Vilnius: ["vilna"], Reykjavik: ["reykjavik"]
};

const COUNTRY_ALIASES = {
  Italy: ["italia"], Spain: ["spagna"], Germany: ["germania"], France: ["francia"],
  UK: ["regno unito", "inghilterra", "united kingdom", "england"], Greece: ["grecia"],
  Turkey: ["turchia", "turkiye"], Portugal: ["portogallo"], Netherlands: ["olanda", "paesi bassi"],
  Switzerland: ["svizzera"], Poland: ["polonia"], Czechia: ["repubblica ceca", "cechia"],
  Hungary: ["ungheria"], Denmark: ["danimarca"], Sweden: ["svezia"], Norway: ["norvegia"],
  Finland: ["finlandia"], Ireland: ["irlanda"], Belgium: ["belgio"], Croatia: ["croazia"],
  Iceland: ["islanda"], Latvia: ["lettonia"], Lithuania: ["lituania"], Slovenia: ["slovenia"],
  Slovakia: ["slovacchia"], Cyprus: ["cipro"], Romania: ["romania"], Bulgaria: ["bulgaria"],
  Serbia: ["serbia"], Albania: ["albania"], Estonia: ["estonia"], Austria: ["austria"]
};

// Italian display names (the English name stays the internal grouping key).
const CITY_IT = {
  London: "Londra", Paris: "Parigi", Milan: "Milano", Rome: "Roma", Venice: "Venezia",
  Naples: "Napoli", Florence: "Firenze", Turin: "Torino", Munich: "Monaco di Baviera",
  Prague: "Praga", Athens: "Atene", Lisbon: "Lisbona", Berlin: "Berlino",
  Copenhagen: "Copenaghen", Warsaw: "Varsavia", Krakow: "Cracovia", Brussels: "Bruxelles",
  Geneva: "Ginevra", Zurich: "Zurigo", Seville: "Siviglia", "Palma de Mallorca": "Palma di Maiorca",
  Nice: "Nizza", Lyon: "Lione", Hamburg: "Amburgo", Cologne: "Colonia", Bucharest: "Bucarest",
  Marseille: "Marsiglia", Belgrade: "Belgrado", Edinburgh: "Edimburgo", Dublin: "Dublino",
  Stockholm: "Stoccolma", Frankfurt: "Francoforte", Gdansk: "Danzica", Zagreb: "Zagabria",
  Thessaloniki: "Salonicco", Ljubljana: "Lubiana", Izmir: "Smirne", Gothenburg: "Göteborg",
  Dusseldorf: "Düsseldorf", Barcelona: "Barcellona", Split: "Spalato", Reykjavik: "Reykjavík",
  Toulouse: "Tolosa"
};
const COUNTRY_IT = {
  UK: "Regno Unito", France: "Francia", Netherlands: "Paesi Bassi", Germany: "Germania",
  Spain: "Spagna", Italy: "Italia", Switzerland: "Svizzera", Portugal: "Portogallo",
  Ireland: "Irlanda", Denmark: "Danimarca", Sweden: "Svezia", Norway: "Norvegia",
  Finland: "Finlandia", Czechia: "Repubblica Ceca", Hungary: "Ungheria", Poland: "Polonia",
  Greece: "Grecia", Turkey: "Turchia", Belgium: "Belgio", Latvia: "Lettonia",
  Lithuania: "Lituania", Croatia: "Croazia", Slovakia: "Slovacchia", Cyprus: "Cipro",
  Iceland: "Islanda"
};
const itCity = (c) => CITY_IT[c] || c;
const itCountry = (c) => COUNTRY_IT[c] || c;

const AIRPORTS = ROWS.map(([code, city, country, lat, lon, hub, name]) => ({
  code, city, country, lat, lon, hub: !!hub, name
}));

const byCode = new Map(AIRPORTS.map((a) => [a.code, a]));
const getAirport = (code) => byCode.get(code);

// city -> airports (insertion order = order in ROWS; first one is the "primary")
const byCity = new Map();
for (const a of AIRPORTS) {
  if (!byCity.has(a.city)) byCity.set(a.city, []);
  byCity.get(a.city).push(a);
}
const primaryAirports = () => [...byCity.values()].map((list) => list[0]);

function distanceKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const norm = (s) =>
  String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

// "Milano Malpensa", but just "Istanbul Airport" (no repeated city name)
const fullName = (a) =>
  norm(a.name).startsWith(norm(itCity(a.city))) ? a.name : `${itCity(a.city)} ${a.name}`;

function cityScore(city, country, s) {
  const names = [city, CITY_IT[city], ...(CITY_ALIASES[city] || [])].filter(Boolean).map(norm);
  if (names.some((n) => n === s)) return 0;
  if (names.some((n) => n.startsWith(s))) return 1;
  if (names.some((n) => n.includes(s))) return 2;
  const countries = [country, COUNTRY_IT[country], ...(COUNTRY_ALIASES[country] || [])]
    .filter(Boolean).map(norm);
  if (countries.some((n) => n.startsWith(s))) return 4;
  return null;
}

function airportMatches(a, s) {
  const code = a.code.toLowerCase();
  if (code === s || (s.length >= 2 && code.startsWith(s))) return true;
  return norm(a.name).includes(s);
}

// Returns options: a "city" group (all airports) first when the city has
// several airports, followed by the individual airports.
// `text` is what goes into the input field once picked (kept short).
function searchAirports(q, limit = 12) {
  const s = norm(q);
  if (!s) return [];
  const hits = [];
  let order = 0;
  for (const [city, list] of byCity) {
    const country = list[0].country;
    let score = cityScore(city, country, s);
    const cityMatch = score !== null;
    const matched = list.filter((a) => airportMatches(a, s));
    if (score === null && matched.length) score = 3;
    if (score === null) continue;
    if (list.some((a) => a.code.toLowerCase() === s)) score = 0; // exact IATA code wins
    hits.push({ city, country, list, score, order: order++, cityMatch, matched });
  }
  hits.sort((x, y) => x.score - y.score || x.order - y.order);
  // A country-only match ("roma" -> Romania) is noise when a city matches.
  if (hits.length && hits[0].score < 4) {
    for (let i = hits.length - 1; i >= 0 && hits[i].score === 4; i--) hits.pop();
  }

  const out = [];
  for (const h of hits) {
    const codes = h.list.map((a) => a.code);
    const cityIt = itCity(h.city);
    const countryIt = itCountry(h.country);
    const airports = h.cityMatch ? h.list : h.matched;
    if (h.list.length > 1) {
      if (h.cityMatch) {
        out.push({
          type: "city", city: cityIt, country: countryIt, codes,
          label: cityIt, sub: `tutti gli aeroporti: ${codes.join(", ")}`, text: cityIt
        });
      }
      for (const a of airports) {
        out.push({
          type: "airport", code: a.code, city: cityIt, country: countryIt, codes: [a.code],
          label: fullName(a), sub: `${countryIt}, ${a.code}`, text: fullName(a)
        });
      }
    } else {
      const a = h.list[0];
      out.push({
        type: "airport", code: a.code, city: cityIt, country: countryIt, codes: [a.code],
        label: cityIt, sub: `${countryIt}, ${a.code}`, text: cityIt
      });
    }
    if (out.length >= limit) break;
  }
  return out.slice(0, limit);
}

// One entry per city (primary airport coordinates) for the map.
function listCities() {
  return [...byCity.values()].map((list) => {
    const p = list[0];
    return {
      city: itCity(p.city), country: itCountry(p.country), code: p.code,
      codes: list.map((a) => a.code), lat: p.lat, lon: p.lon
    };
  });
}

module.exports = {
  AIRPORTS, getAirport, distanceKm, searchAirports, primaryAirports, listCities, itCity, itCountry
};
