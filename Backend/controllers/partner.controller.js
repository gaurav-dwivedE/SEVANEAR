const partnerModel = require("../model/partner.model");
const applicationModel = require("../model/applications.model");
const { ok, fail, crash } = require("../utils/availability");

const explain = (res, label, e) => {
  if (e?.code === 11000) return fail(res, "A partner with this mobile number already exists.", 409);
  if (e?.name === "ValidationError") return fail(res, Object.values(e.errors).map((x) => x.message).join(" "), 400);
  return crash(res, label, e);
};

const PIN = /^[1-9][0-9]{5}$/;

function read(b = {}) {
  const services = [].concat(b.service || []).filter(Boolean);
  const pins = [...new Set([].concat(b.serviceablePincodes || []).map(String).filter((p) => PIN.test(p)))];
  const loc = b.location || {};
  if (PIN.test(String(loc.pincode)) && !pins.includes(String(loc.pincode))) pins.push(String(loc.pincode));
  return {
    name: b.name?.trim(), phone: String(b.phone || "").replace(/\D/g, "").slice(-10), image: b.image || "",
    service: services, serviceablePincodes: pins,
    location: { street: loc.street || "", city: loc.city || "", state: loc.state || "", pincode: loc.pincode || "" },
    isActive: b.isActive !== false,
  };
}

function check(d) {
  if (!d.name) return "Partner name is required.";
  if (!/^[6-9][0-9]{9}$/.test(d.phone)) return "A valid 10-digit mobile number is required.";
  if (!d.service.length) return "Select at least one service.";
  if (!d.serviceablePincodes.length) return "Add at least one service-area PIN code.";
  return null;
}

// Admin only (contains phone numbers).
async function getPartnersController(req, res) {
  try {
    const filter = {};
    if (req.query.service) filter.service = req.query.service;
    if (req.query.pincode) filter.serviceablePincodes = req.query.pincode;
    ok(res, await partnerModel.find(filter).populate("service", "name").sort({ createdAt: -1 }));
  } catch (e) { crash(res, "Fetch partners", e); }
}

async function createPartnerController(req, res) {
  try {
    const d = read(req.body); const err = check(d);
    if (err) return fail(res, err);
    if (await partnerModel.exists({ phone: d.phone })) return fail(res, "A partner with this mobile number already exists.", 409);
    ok(res, await partnerModel.create(d), { message: "Partner added." }, 201);
  } catch (e) { explain(res, "Create partner", e); }
}

async function updatePartnerController(req, res) {
  try {
    const d = read(req.body); const err = check(d);
    if (err) return fail(res, err);
    if (await partnerModel.exists({ phone: d.phone, _id: { $ne: req.params.id } })) return fail(res, "Another partner already uses this mobile number.", 409);
    const p = await partnerModel.findByIdAndUpdate(req.params.id, d, { new: true, runValidators: true });
    if (!p) return fail(res, "Partner not found.", 404);
    ok(res, p, { message: "Partner updated." });
  } catch (e) { explain(res, "Update partner", e); }
}

async function deletePartnerController(req, res) {
  try {
    const p = await partnerModel.findByIdAndDelete(req.params.id);
    if (!p) return fail(res, "Partner not found.", 404);
    await applicationModel.updateMany({ partner: p._id, status: { $in: ["pending", "approved"] } }, { $unset: { partner: 1 } });
    ok(res, null, { message: "Partner deleted." });
  } catch (e) { crash(res, "Delete partner", e); }
}

module.exports = { getPartnersController, createPartnerController, updatePartnerController, deletePartnerController };
