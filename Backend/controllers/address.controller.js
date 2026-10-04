const addressModel = require("../model/address.model");
const userModel = require("../model/user.model");
const { ok, fail, crash } = require("../utils/availability");

const pick = (b = {}) => ({
  label: ["Home", "Work", "Other"].includes(b.label) ? b.label : "Home",
  contactName: b.contactName, mobile: String(b.mobile || "").replace(/\D/g, "").slice(-10),
  houseNo: b.houseNo, street: b.street, landmark: b.landmark, city: b.city, state: b.state,
  zipCode: String(b.zipCode || "").trim(),
});

function validate(d) {
  if (!/^[6-9][0-9]{9}$/.test(d.mobile)) return "A valid 10-digit mobile number is required.";
  if (!/^[1-9][0-9]{5}$/.test(d.zipCode)) return "A valid 6-digit PIN code is required.";
  if (!d.street || !d.city || !d.state) return "Street / area, city and state are required.";
  return null;
}

async function createAddressController(req, res) {
  try {
    const d = pick(req.body);
    const err = validate(d);
    if (err) return fail(res, err);
    const address = await addressModel.create({ ...d, user: req.user.user });
    await userModel.findByIdAndUpdate(req.user.user, { $push: { address: address._id } });
    ok(res, address, { message: "Address saved." }, 201);
  } catch (e) { crash(res, "Create address", e); }
}

async function updateAddressController(req, res) {
  try {
    const d = pick(req.body);
    const err = validate(d);
    if (err) return fail(res, err);
    const address = await addressModel.findOneAndUpdate({ _id: req.params.id, user: req.user.user }, d, { new: true, runValidators: true });
    if (!address) return fail(res, "Address not found.", 404);
    ok(res, address, { message: "Address updated." });
  } catch (e) { crash(res, "Update address", e); }
}

async function getMyAddressesController(req, res) {
  try { ok(res, await addressModel.find({ user: req.user.user }).sort({ createdAt: -1 })); }
  catch (e) { crash(res, "Fetch addresses", e); }
}

async function deleteAddressController(req, res) {
  try {
    const address = await addressModel.findOneAndDelete({ _id: req.params.id, user: req.user.user });
    if (!address) return fail(res, "Address not found.", 404);
    await userModel.findByIdAndUpdate(req.user.user, { $pull: { address: address._id } });
    ok(res, null, { message: "Address removed." });
  } catch (e) { crash(res, "Delete address", e); }
}

module.exports = { createAddressController, updateAddressController, getMyAddressesController, deleteAddressController };
