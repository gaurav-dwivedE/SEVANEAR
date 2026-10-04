const express = require("express");
const router = express.Router();
const { registerController, loginController, meController, getAllUsersController, setPincodeController, getUserDetailsController, blockUserController, deleteUserController } = require("../controllers/auth.controller");
const { authMiddleware, requireAdmin } = require("../middlewares/auth.middleware");

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", authMiddleware, meController);
router.get("/users", authMiddleware, requireAdmin, getAllUsersController);

router.patch("/me/pincode", authMiddleware, setPincodeController);
router.get("/users/:id", authMiddleware, requireAdmin, getUserDetailsController);
router.patch("/users/:id/block", authMiddleware, requireAdmin, blockUserController);
router.delete("/users/:id", authMiddleware, requireAdmin, deleteUserController);

module.exports = router;
