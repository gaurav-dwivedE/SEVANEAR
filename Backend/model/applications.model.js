const mongoose = require("mongoose");

const STATUSES = ["pending", "approved", "in_progress", "completed", "rejected", "cancelled"];

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    partner: { type: mongoose.Schema.Types.ObjectId, ref: "Partner" },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    selectedAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
    additionalDetails: { type: String, maxlength: 1000 },
    scheduledDate: { type: Date },
    timeSlot: { type: String, enum: ["09:00-12:00", "12:00-15:00", "15:00-18:00", "18:00-21:00"] },
    priceEstimate: { type: Number, default: 0 },
    // Price breakdown frozen at booking time so the invoice never changes if the service price does.
    pricing: {
      servicePrice: { type: Number, default: 0 },
      visitFee: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    // Extra charges added by the admin after the visit (parts, extra work, discounts as negatives).
    adjustments: [{ _id: false, label: { type: String, required: true, maxlength: 80 }, amount: { type: Number, required: true } }],
    paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    paidAt: { type: Date },
    status: { type: String, enum: STATUSES, default: "pending", index: true },
    cancelReason: { type: String, maxlength: 300 },
    cancelledBy: { type: String, enum: ["user", "admin"] },
    cancelledAt: { type: Date },
    // Customer removed it from their list. Admin records and public reviews are kept.
    deletedByUser: { type: Boolean, default: false, index: true },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String, maxlength: 600 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
module.exports.STATUSES = STATUSES;
