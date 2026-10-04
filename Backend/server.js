require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./src/app");
const dbConnect = require("./db/db");

["MONGO_URI", "JWT_SECRET"].forEach((k) => {
  if (!process.env[k]) {
    console.error(`Missing required env var ${k}`);
    process.exit(1);
  }
});
if (process.env.NODE_ENV === "production" && process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must be at least 32 characters in production.");
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

(async () => {
  await dbConnect();

  // v3 shipped a compound index over two array fields, which MongoDB rejects on insert.
  // Remove it from existing databases (harmless if it was never created).
  try {
    await require("./model/partner.model").collection.dropIndex("serviceablePincodes_1_service_1");
    console.log("Removed stale partner index (serviceablePincodes_1_service_1).");
  } catch (e) {
    /* index not present: nothing to do */
  }
  await require("./model/partner.model").syncIndexes().catch((e) => console.error("Index sync warning:", e.message));
  const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  const shutdown = (sig) => {
    console.log(`${sig} received, shutting down...`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  ["SIGTERM", "SIGINT"].forEach((s) => process.on(s, () => shutdown(s)));
})();

process.on("unhandledRejection", (e) => console.error("Unhandled rejection:", e));
