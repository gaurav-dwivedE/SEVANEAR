const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: false,
    }]

}, { timestamps: true });


const userModel = mongoose.model("User", userSchema);
module.exports = userModel;

