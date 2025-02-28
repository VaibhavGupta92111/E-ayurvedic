const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/Cloudinary");

// DB Model
const Product = require("../models/Products");

const router = express.Router();

// Multer configuration (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Route 1: Upload Product
router.post("/products", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        // Upload image to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "products" },
                (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );
            stream.end(req.file.buffer);
        });

        const imageUrl = result.secure_url;  // ✅ FIXED: Now capturing image URL
        const { name, description, price, category, quantity, seller } = req.body;

        if (!name || !description || !price || !category || !quantity || !seller) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            quantity,
            seller,
            imageurl: imageUrl, // ✅ FIXED: Storing Image URL in DB
        });

        await newProduct.save();

        res.status(201).json({
            message: "Product uploaded successfully",
            product: newProduct,
            imageUrl: imageUrl, // ✅ FIXED: Returning Image URL in Response
        });

    } catch (error) {
        res.status(500).json({ message: "Error uploading product", error: error.message });
    }
});

// ✅ Route 2: Get All Products
router.get("/home_Products", async (req, res) => {
    try {
        const products = await Product.find()
        .populate("seller", "store_name") // ✅ Populate seller's store_name
        .exec();
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
});

// ✅ Route 3: Update Product (PATCH)
router.patch("/products/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
});

// ✅ Route 4: Delete Product
router.delete("/products/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
});

module.exports = router;
