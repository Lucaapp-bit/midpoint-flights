const { providerName } = require("./_providers.js");

module.exports = (req, res) => {
  res.status(200).json({ ok: true, message: "le funzioni funzionano", provider: providerName() });
};
