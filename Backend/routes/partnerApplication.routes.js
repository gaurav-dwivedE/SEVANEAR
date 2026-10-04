const express = require("express");
const router = express.Router();
const { authMiddleware, requireAdmin } = require("../middlewares/auth.middleware");
const {
  createPartnerApplicationController,
  getPartnerApplicationsController,
  updatePartnerApplicationController,
} = require("../controllers/partnerApplication.controller");

router.post("/", createPartnerApplicationController); // public - "Become a Partner" form
router.get("/", authMiddleware, requireAdmin, getPartnerApplicationsController);
router.patch("/:id", authMiddleware, requireAdmin, updatePartnerApplicationController);

module.exports = router;
