const express = require("express");
const router = express.Router();
const { authMiddleware, requireAdmin } = require("../middlewares/auth.middleware");
const c = require("../controllers/category.controller");

router.get("/", c.listCategories);
router.post("/", authMiddleware, requireAdmin, c.createCategory);
router.patch("/:id", authMiddleware, requireAdmin, c.updateCategory);
router.delete("/:id", authMiddleware, requireAdmin, c.deleteCategory);

module.exports = router;
