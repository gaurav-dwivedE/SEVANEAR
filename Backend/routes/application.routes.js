const express = require("express");
const router = express.Router();
const { authMiddleware, requireAdmin, requireCustomer } = require("../middlewares/auth.middleware");
const c = require("../controllers/application.controller");

router.post("/", authMiddleware, requireCustomer, c.createApplicationController);
router.get("/", authMiddleware, c.getMyApplicationsController);
router.get("/all", authMiddleware, requireAdmin, c.getAllApplicationsController);
router.get("/:id", authMiddleware, c.getApplicationController);
router.post("/:id/cancel", authMiddleware, requireCustomer, c.cancelApplicationController);
router.post("/:id/review", authMiddleware, requireCustomer, c.reviewApplicationController);
router.patch("/:id", authMiddleware, requireAdmin, c.updateApplicationController);
router.delete("/:id/mine", authMiddleware, requireCustomer, c.deleteMyApplicationController);
router.delete("/:id", authMiddleware, requireAdmin, c.deleteApplicationController);

module.exports = router;
