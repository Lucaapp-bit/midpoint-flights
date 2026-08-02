// Duffel provider — real fares via the Duffel Flights API.
// Docs: https://duffel.com/docs/guides/getting-started-with-flights
//
// Flow: create an Offer Request (a search) -> Duffel returns `offers`.
// We only need search (shopping), never booking, so this is read-only.
//
// Env vars (set on Vercel):
//   DUFFEL_TOKEN   -> your token (duffel_test_... or duffel_live_...)
//   DUFFEL_VERSION -> API version, defaults to "v2"
//
// Note on TEST tokens: Duffel's sandbox only returns "Duffel Airways" (ZZ)
// offers with UNREALISTIC prices/times. Real prices require a LIVE token
// and an activated account. Same code works for both — only the token changes.

const DUFFEL_HOST = "https://api.duffel.com";

function isoMinutes(iso) {
  if (!iso) return null;
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?/.exec(iso);
  if (!m) return null;
  return parseInt(m[1] || 0) * 60 + parseInt(m[2] || 0);
}

export async function duffelPrice({ origin, destination, departDate, returnDate, nonStop }) {
  if (origin === destination) return null;
  const token = process.env.DUFFEL_TOKEN;
  if (!token) return null;
  const version = process.env.DUFFEL_VERSION || "v2";

  // Build slices. We keep it one-way to limit API load; if a returnDate is
  // provided we add the return slice too.
  const slices = [{ origin, destination, departure_date: departDate }];
  if (returnDate) {
    slices.push({ origin: destination, destination: origin, departure_date: returnDate });
  }

  const payload = {
    data: {
      slices,
      passengers: [{ type: "adult" }],
      cabin_class: "economy"
    }
  };

  try {
    // `return_offers=true` asks Duffel to include the offers array in the
    // response so we don't need a second call to fetch them.
    const res = await fetch(
      `${DUFFEL_HOST}/air/offer_requests?return_offers=true`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Duffel-Version": version,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      }
    );
    if (!res.ok) {
      // 401/403 = bad token; 422 = unsupported route. Fail soft -> null.
      return null;
    }
    const json = await res.json();
    const offers = json?.data?.offers || [];
    if (offers.length === 0) return null;

    let best = null;
    for (const o of offers) {
      const price = parseFloat(o.total_amount);
      if (!Number.isFinite(price)) continue;
      if (nonStop) {
        // Skip offers where any slice has more than one segment.
        const hasStop = (o.slices || []).some((s) => (s.segments || []).length > 1);
        if (hasStop) continue;
      }
      if (!best || price < best.price) {
        const seg0 = o.slices?.[0]?.segments || [];
        best = {
          price,
          currency: o.total_currency || "EUR",
          nonStop: seg0.length <= 1,
          durationMinutes: isoMinutes(o.slices?.[0]?.duration),
          origin,
          destination
        };
      }
    }
    if (best) best.price = Math.round(best.price);
    return best;
  } catch (e) {
    console.error("[duffel]", e.message);
    return null;
  }
}
