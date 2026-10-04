const mongoose = require('mongoose');

// Public intake form submitted from the "Become a Partner" page.
// An admin reviews these and, on approval, creates a real Partner record.
const partnerApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    pincode: {
        type: String,
        match: /^[1-9][0-9]{5}$/,
    },
    city: {
        type: String,
        required: true,
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
    experience: {
        type: String, // e.g. "0-1 years", "2-5 years", "5+ years"
    },
    message: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
}, { timestamps: true });

const partnerApplicationModel = mongoose.model("PartnerApplication", partnerApplicationSchema);
module.exports = partnerApplicationModel;
