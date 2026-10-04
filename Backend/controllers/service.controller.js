const serviceModel = require("../model/service.model");
const categoryModel = require("../model/category.model");
const applicationModel = require("../model/applications.model");
const { serviceIdsAvailableAt, ok, fail, crash } = require("../utils/availability");

const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Public. Query: category (id), q (text), pincode (only services available there).
async function getServicesController(req, res) {
  try {
    const { category, q, pincode } = req.query;
    const filter = {};
    if (req.query.all !== "1") filter.isActive = { $ne: false };
    if (category && /^[a-f0-9]{24}$/i.test(category)) filter.category = category;
    if (q) filter.$or = [{ name: new RegExp(esc(q), "i") }, { description: new RegExp(esc(q), "i") }];
    if (pincode) {
      if (!/^[1-9][0-9]{5}$/.test(pincode)) return fail(res, "Enter a valid 6-digit PIN code.");
      filter._id = { $in: await serviceIdsAvailableAt(pincode) };
    }
    ok(res, await serviceModel.find(filter).populate("category", "name").sort({ name: 1 }));
  } catch (e) { crash(res, "Fetch services", e); }
}

async function getServiceByIdController(req, res) {
  try {
    const service = await serviceModel.findById(req.params.id).populate("category", "name");
    if (!service) return fail(res, "Service not found.", 404);
    const out = service.toObject();
    if (req.query.pincode && /^[1-9][0-9]{5}$/.test(req.query.pincode)) {
      out.availableAtPincode = (await serviceIdsAvailableAt(req.query.pincode)).some((id) => String(id) === String(service._id));
    }
    ok(res, out);
  } catch (e) { crash(res, "Fetch service", e); }
}

const validImage = (u) => typeof u === "string" && (/^https:\/\//.test(u) || /^\/img\//.test(u));

function readBody(b = {}) {
  // Up to 5 images; the first is the cover. A single legacy `image` is still accepted.
  let images;
  if (Array.isArray(b.images)) images = [...new Set(b.images.filter(validImage))].slice(0, 5);
  else if (validImage(b.image)) images = [b.image];
  const inclusions = Array.isArray(b.inclusions)
    ? b.inclusions
    : String(b.inclusions || "").split("\n");
  return {
    name: b.name, description: b.description, startingPrice: b.startingPrice, category: b.category || undefined,
    images, image: images ? images[0] || "" : undefined, durationMins: b.durationMins, isActive: b.isActive,
    inclusions: inclusions.map((s) => s.trim()).filter(Boolean),
  };
}

// Public: ratings and written reviews left by customers after a completed booking.
async function getServiceReviewsController(req, res) {
  try {
    const service = await serviceModel.findById(req.params.id).select("ratingAvg ratingCount");
    if (!service) return fail(res, "Service not found.", 404);
    const rows = await applicationModel
      .find({ service: req.params.id, rating: { $gte: 1 } })
      .populate("user", "name")
      .sort({ updatedAt: -1 })
      .limit(100);
    // Show "Rahul S." rather than a full name.
    const mask = (n = "Customer") => {
      const [first, ...rest] = String(n).trim().split(/\s+/);
      return rest.length ? `${first} ${rest[rest.length - 1][0].toUpperCase()}.` : first;
    };
    const distribution = [0, 0, 0, 0, 0];
    rows.forEach((r) => (distribution[r.rating - 1] += 1));
    ok(res, {
      average: service.ratingAvg,
      count: service.ratingCount,
      distribution,
      reviews: rows.map((r) => ({ _id: r._id, rating: r.rating, review: r.review || "", name: mask(r.user?.name), date: r.updatedAt })),
    });
  } catch (e) { crash(res, "Fetch reviews", e); }
}

async function createServiceController(req, res) {
  try {
    const d = readBody(req.body);
    if (!d.name || !d.description) return fail(res, "Name and description are required.");
    if (!d.category || !(await categoryModel.exists({ _id: d.category }))) return fail(res, "Please select a category.");
    if (!(Number(d.startingPrice) >= 0)) return fail(res, "Enter a valid starting price.");
    ok(res, await serviceModel.create(d), { message: "Service created." }, 201);
  } catch (e) { crash(res, "Create service", e); }
}

async function updateServiceController(req, res) {
  try {
    const d = readBody(req.body);
    if (d.category && !(await categoryModel.exists({ _id: d.category }))) return fail(res, "Category not found.");
    const service = await serviceModel.findByIdAndUpdate(req.params.id, d, { new: true, runValidators: true });
    if (!service) return fail(res, "Service not found.", 404);
    ok(res, service, { message: "Service updated." });
  } catch (e) { crash(res, "Update service", e); }
}

async function deleteServiceController(req, res) {
  try {
    const open = await applicationModel.countDocuments({ service: req.params.id, status: { $in: ["pending", "approved", "in_progress"] } });
    if (open) return fail(res, `${open} open booking(s) use this service. Complete or cancel them first.`, 409);
    const service = await serviceModel.findByIdAndDelete(req.params.id);
    if (!service) return fail(res, "Service not found.", 404);
    ok(res, null, { message: "Service deleted." });
  } catch (e) { crash(res, "Delete service", e); }
}

module.exports = {
  getServiceReviewsController, getServicesController, getServiceByIdController, createServiceController, updateServiceController, deleteServiceController };
