const express = require("express");
const multer = require("multer");
const router = express.Router();
const { authMiddleware, requireAdmin } = require("../middlewares/auth.middleware");
const { lookupPincode } = require("../controllers/pincode.controller");
const { uploadImage } = require("../controllers/upload.controller");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => (/^image\/(jpeg|png|webp)$/.test(file.mimetype) ? cb(null, true) : cb(new Error("Only JPG, PNG or WebP images are allowed."))),
});

router.get("/pincode/:pin", lookupPincode);
router.post("/uploads", authMiddleware, requireAdmin, (req, res, next) =>
  upload.single("image")(req, res, (err) =>
    err ? res.status(400).json({ status: "failed", message: err.code === "LIMIT_FILE_SIZE" ? "Image must be under 5 MB." : err.message }) : next()
  ), uploadImage);

module.exports = router;
