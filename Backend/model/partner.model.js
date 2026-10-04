const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, match: /^[6-9][0-9]{9}$/ },
    image: { type: String, default: "" },
    service: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    location: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
    // PIN codes this partner works in. A service is "available" at a PIN code
    // when at least one active partner offering it covers that PIN code.
    serviceablePincodes: [{ type: String, match: /^[1-9][0-9]{5}$/ }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// MongoDB cannot build one index over two array fields ("parallel arrays"),
// so each array gets its own single-field index.
partnerSchema.index({ serviceablePincodes: 1 });
partnerSchema.index({ service: 1 });

module.exports = mongoose.model("Partner", partnerSchema);
