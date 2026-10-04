const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", index: true },
    image: { type: String, default: "" }, // cover image (always images[0])
    images: {
      type: [String],
      default: [],
      validate: { validator: (v) => v.length <= 5, message: "A service can have at most 5 images." },
    },
    startingPrice: { type: Number, required: true, default: 0, min: 0 },
    durationMins: { type: Number, default: 60 },
    inclusions: [{ type: String }],
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
