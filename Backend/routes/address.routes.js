const express = require("express");
const router = express.Router();
const { authMiddleware, requireCustomer } = require("../middlewares/auth.middleware");
const c = require("../controllers/address.controller");

router.use(authMiddleware, requireCustomer);
router.post("/", c.createAddressController);
router.get("/", c.getMyAddressesController);
router.patch("/:id", c.updateAddressController);
router.delete("/:id", c.deleteAddressController);

module.exports = router;
