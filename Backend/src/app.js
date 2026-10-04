const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");

const app = express();
const isProd = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);
app.use(helmet());
app.use(compression());
app.use(morgan(isProd ? "combined" : "dev"));

// CORS_ORIGINS = comma-separated list of allowed frontend origins (required in production)
const origins = (process.env.CORS_ORIGINS || "http://localhost:5173").split(",").map((s) => s.trim());
app.use(cors({ origin: origins, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Admins are never rate limited (the dashboard makes many requests).
const isAdminRequest = (req) => {
  try {
    const t = (req.headers.authorization || "").split(" ")[1];
    return !!t && jwt.verify(t, process.env.JWT_SECRET).role === "admin";
  } catch {
    return false;
  }
};

const limiter = (max, windowMin = 15, extra = {}) =>
  rateLimit({
    windowMs: windowMin * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skip: isAdminRequest,
    message: { status: "failed", message: "Too many requests. Please wait a few minutes and try again." },
    ...extra,
  });

app.use("/api/v1", limiter(1500));
// Only failed logins count towards the limit.
app.use("/api/v1/auth/login", limiter(20, 15, { skipSuccessfulRequests: true }));
app.use("/api/v1/auth/register", limiter(10, 60));
app.use("/api/v1/partner-applications", limiter(10, 60));

app.use("/api/v1/auth", require("../routes/auth.routes"));
app.use("/api/v1/services", require("../routes/service.routes"));
app.use("/api/v1/addresses", require("../routes/address.routes"));
app.use("/api/v1/applications", require("../routes/application.routes"));
app.use("/api/v1/categories", require("../routes/category.routes"));
app.use("/api/v1", require("../routes/misc.routes"));
app.use("/api/v1/partners", require("../routes/partner.routes"));
app.use("/api/v1/partner-applications", require("../routes/partnerApplication.routes"));

app.get("/api/v1/health", (req, res) =>
  res.status(200).json({ status: "success", message: "SevaNear API is running.", uptime: process.uptime() })
);

app.use((req, res) => res.status(404).json({ status: "failed", message: "Route not found." }));

// Central error handler (bad JSON, invalid ObjectIds, anything uncaught)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") return res.status(400).json({ status: "failed", message: "Invalid JSON body." });
  if (err.name === "CastError") return res.status(400).json({ status: "failed", message: "Invalid id." });
  if (err.name === "ValidationError") return res.status(400).json({ status: "failed", message: err.message });
  console.error(err);
  res.status(500).json({ status: "error", message: "An unexpected error occurred. Please try again later." });
});

module.exports = app;
