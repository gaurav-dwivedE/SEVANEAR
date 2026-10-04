const express = require("express");
const router = express.Router();
const { authMiddleware, requireAdmin } = require("../middlewares/auth.middleware");
const {
  getServicesController,
  getServiceByIdController,
  getServiceReviewsController,
  createServiceController,
  updateServiceController,
  deleteServiceController,
} = require("../controllers/service.controller");

router.get("/", getServicesController);
router.get("/:id/reviews", getServiceReviewsController);
router.get("/:id", getServiceByIdController);
router.post("/", authMiddleware, requireAdmin, createServiceController);
router.patch("/:id", authMiddleware, requireAdmin, updateServiceController);
router.delete("/:id", authMiddleware, requireAdmin, deleteServiceController);

module.exports = router;
