const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    store_name: { type: String, required: true }, // ✅ Ensure this field exists
    address: { type: String, required: true },
    contact: { type: String, required: true },
    isEmailVerified:{type:Boolean,default:false,enum:[true,false]},

}, { timestamps: true });


module.exports = mongoose.model("Seller", sellerSchema);
