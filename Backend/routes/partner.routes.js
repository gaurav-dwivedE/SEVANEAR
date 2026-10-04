const express = require("express");
const router = express.Router();
const { authMiddleware, requireAdmin } = require("../middlewares/auth.middleware");
const c = require("../controllers/partner.controller");

router.use(authMiddleware, requireAdmin);
router.get("/", c.getPartnersController);
router.post("/", c.createPartnerController);
router.patch("/:id", c.updatePartnerController);
router.delete("/:id", c.deletePartnerController);

module.exports = router;
