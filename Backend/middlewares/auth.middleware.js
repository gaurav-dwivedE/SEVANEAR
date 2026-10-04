const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");

// Verifies the token, then re-checks the user in the database so that
// blocked / deleted accounts and role changes take effect immediately.
async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ status: "failed", message: "Authentication required. Please login." });
    }
    const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.user).select("role isBlocked email");
    if (!user) return res.status(401).json({ status: "failed", message: "Account no longer exists." });
    if (user.isBlocked) {
      return res.status(403).json({ status: "failed", code: "BLOCKED", message: "Your account has been blocked. Contact support." });
    }
    req.user = { user: String(user._id), role: user.role, email: user.email };
    next();
  } catch (error) {
    return res.status(401).json({ status: "failed", message: "Invalid or expired session. Please login again." });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ status: "failed", message: "Admin access required." });
  }
  next();
}

function requireCustomer(req, res, next) {
  if (req.user?.role === "admin") {
    return res.status(403).json({ status: "failed", message: "Admin accounts cannot place bookings." });
  }
  next();
}

module.exports = { authMiddleware, requireAdmin, requireCustomer };
