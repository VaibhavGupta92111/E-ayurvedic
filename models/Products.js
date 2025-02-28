const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    quantity: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    imageurl: { type: String, required: true } // ✅ Ensure this field is included
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);



//api keys:dpqbgmcrc,
//api key:517343171852384,
//api secret:j4eLzg2B0FmRz0TMGuiRcpI7F8c,