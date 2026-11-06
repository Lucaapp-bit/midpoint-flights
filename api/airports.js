const { searchAirports, listCities } = require("./_airports.js");

module.exports = (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=3600");
  const query = req.query || {};
  if (query.all) return res.status(200).json(listCities());
  res.status(200).json(searchAirports(String(query.q || "")));
};
