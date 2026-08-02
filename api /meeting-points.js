import { searchAirports } from "./_airports.js";

export default function handler(req, res) {
  const q = req.query.q || "";
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).json(searchAirports(String(q)));
}
