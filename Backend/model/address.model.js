const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    zipCode: {
        type: String,
        required: true,
    },
     state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },

    street: {
        type: String,
        required: true,
    },
    
    belongsTo: {
        type: String,
        enum: ["user", "partner"],
        default: "user",
    }
    
}, { timestamps: true });

const addressModel = mongoose.model("Address", addressSchema);
module.exports = addressModel;
