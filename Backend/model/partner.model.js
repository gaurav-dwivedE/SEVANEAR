const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    service: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true
    }],
    
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: false
    }],

}, { timestamps: true });
   

const partnerModel = mongoose.model("Partner", partnerSchema);
module.exports = partnerModel;