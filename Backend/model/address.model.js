const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    label: { type: String, enum: ["Home", "Work", "Other"], default: "Home" },
    contactName: { type: String, trim: true, maxlength: 80 },
    mobile: { type: String, required: true, match: /^[6-9][0-9]{9}$/ },
    houseNo: { type: String, trim: true, maxlength: 80 },
    street: { type: String, required: true, trim: true, maxlength: 200 },
    landmark: { type: String, trim: true, maxlength: 120 },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, match: /^[1-9][0-9]{5}$/ },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
