const categoryModel = require("../model/category.model");
const serviceModel = require("../model/service.model");
const { ok, fail, crash } = require("../utils/availability");

async function listCategories(req, res) {
  try {
    const filter = req.query.all === "1" && req.user?.role === "admin" ? {} : { isActive: true };
    ok(res, await categoryModel.find(filter).sort({ name: 1 }));
  } catch (e) { crash(res, "List categories", e); }
}

async function createCategory(req, res) {
  try {
    const { name, description } = req.body || {};
    if (!name || !name.trim()) return fail(res, "Category name is required.");
    if (await categoryModel.exists({ name: new RegExp(`^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") })) {
      return fail(res, "A category with this name already exists.", 409);
    }
    ok(res, await categoryModel.create({ name, description }), { message: "Category created." }, 201);
  } catch (e) { crash(res, "Create category", e); }
}

async function updateCategory(req, res) {
  try {
    const { name, description, isActive } = req.body || {};
    const cat = await categoryModel.findByIdAndUpdate(req.params.id, { name, description, isActive }, { new: true, runValidators: true });
    if (!cat) return fail(res, "Category not found.", 404);
    ok(res, cat, { message: "Category updated." });
  } catch (e) { crash(res, "Update category", e); }
}

async function deleteCategory(req, res) {
  try {
    const used = await serviceModel.countDocuments({ category: req.params.id });
    if (used) return fail(res, `${used} service(s) use this category. Move or delete them first.`, 409);
    const cat = await categoryModel.findByIdAndDelete(req.params.id);
    if (!cat) return fail(res, "Category not found.", 404);
    ok(res, null, { message: "Category deleted." });
  } catch (e) { crash(res, "Delete category", e); }
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
