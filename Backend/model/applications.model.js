const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    partner: { // For initial stage  partner will be assigned by the admin after the application is approved 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Partner",
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    selectedAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },
    additionalDetails: {
        type: String,
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
   
}, { timestamps: true });

const applicationModel = mongoose.model("Application", applicationSchema);
module.exports = applicationModel;