const { searchAirports } = require("./_airports.js");

module.exports = (req, res) => {
  const q = (req.query && req.query.q) || "";
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).json(searchAirports(String(q)));
};
