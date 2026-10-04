const { ok, fail } = require("../utils/availability");

const cache = new Map();

// Validates a PIN code with India Post's public API and returns city/state.
async function lookupPincode(req, res) {
  const pin = req.params.pin;
  if (!/^[1-9][0-9]{5}$/.test(pin)) return fail(res, "PIN code must be 6 digits.");
  if (cache.has(pin)) return ok(res, cache.get(pin));
  try {
    const r = await fetch(`https://api.postalpincode.in/pincode/${pin}`, { signal: AbortSignal.timeout(6000) });
    const json = await r.json();
    const first = Array.isArray(json) ? json[0] : null;
    if (!first || first.Status !== "Success" || !first.PostOffice?.length) {
      return fail(res, "This PIN code does not exist. Please check and try again.", 404);
    }
    const po = first.PostOffice[0];
    const data = { pincode: pin, city: po.District, state: po.State, areas: first.PostOffice.map((p) => p.Name).slice(0, 12) };
    cache.set(pin, data);
    ok(res, data);
  } catch (e) {
    res.status(502).json({ status: "failed", message: "Could not verify the PIN code right now. Please try again." });
  }
}

module.exports = { lookupPincode };
