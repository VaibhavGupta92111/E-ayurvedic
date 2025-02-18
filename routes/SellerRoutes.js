const express = require('express');
const Seller = require('../models/Seller');
const { sendEmail } = require("../config/emailConfig");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');

const {generateOTP,sendemail} = require("../utils/sendOTP")

router.post("/seller", async (req, res) => {
    try {
        const { name, email, password, store_name, address, contact } = req.body; // ✅ Use store_name

        if (!store_name) {
            return res.status(400).json({ message: "store_name is required" });
        }

        const existingUser = await Seller.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
console.log(hashedPassword);
//otpo generate
const otp = generateOTP();
console.log(otp);
const otpToken = jwt.sign({
    email,otp
},process.env.JWT_SECRET,{expiresIn:"10m"});
console.log(otpToken);


await sendemail(email,otp);

        const createdSeller = new Seller({
            name,
            email,
            password:hashedPassword,
            store_name, // ✅ Make sure this matches the schema
            address,
            contact
        });

        const result = await createdSeller.save();
        return res.status(201).json({ message: "Seller created", seller: result });

    } catch (err) {
        console.error("Error creating Seller:", err);
        return res.status(500).json({ message: "Error creating Seller", error: err });
    }
});



router.post("/seller/bulk", async (req, res) => {
    try {
        const sellers = req.body;
        if (!Array.isArray(sellers) || sellers.length === 0) {
            return res.status(400).json({ message: "Please provide an array of sellers" });
        }
        const emails = sellers.map(sellerdata => sellerdata.email);
        const existingSellers = await Seller.find({ email: { $in: emails } });
        if (existingSellers.length > 0) {
            return res.status(400).json({ message: "Some sellers already exists", existingSellers });
        }

        await Seller.insertMany(sellers);

        res.status(200).json({ message: "Sellers created successfully", sellers });
    } catch (error) {
        res.status(500).json({ message: "Error creating Sellers", error });
    }
})


router.get('/seller', async (req, res) => {
    try {
        const sellers = await Seller.find();
        res.status(200).json({ sellers });
    } catch (error) {
        res.status(500).json({ message: "Error fetching Sellers", error });
    }
});
//seller login route
router.post("/seller/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(401).json({ message: "Invalid email or password" });
        }


        if(seller.isEmailVerified !== true)
        {
            return res.status(400).json({message:"email is not verified please verify it"});
        }

        const result=await bcrypt.compare(password,seller.password);
        if(!result){
            return res.status(401).json({ message: " Does not match password" });
        }

        // if (password !== seller.password) {
        //     return res.status(401).json({ message: "Invalid email or password" });
        // }
        const token = jwt.sign({ sellerId: seller._id },
             process.env.JWT_SECRET,
             { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", seller, token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});

router.get("/seller/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching User", error });
    }
})
// //create a router for put
router.put("/seller/:id", async (req, res) => {
    try {
        const updatedSeller = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSeller) {
            return res.status(404).json({ message: "Seller not found" });
        }
        res.status(200).json({ message: "Seller updated successfully", updatedSeller });
        await seller.save();
        res.status(200).json({ message: "Seller updated successfully", updatedSeller });
    } catch (error) {
        return res.status(500).json({ message: "Error updating Seller", updatedSeller });
    }
})
//create a router for patch
router.patch("/seller/:id", async (req, res) => {
    try {
        const updatedSeller = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSeller) {
            return res.status(404).json({ message: "Seller not found" });
        }
        res.status(200).json({ message: "Seller updated successfully", updatedSeller });
        await seller.save();
        res.status(200).json({ message: "Seller updated successfully", updatedSeller });
    } catch (error) {
        return res.status(500).json({ message: "Error updating Seller", updatedSeller });
    }
})
//create a router for delete
router.delete("/seller/:id", async (req, res) => {
    try {
        const deletedSeller = await Seller.findByIdAndDelete(req.params.id);
        if (!deletedSeller) {
            return res.status(404).json({ message: "Seller not found" });
        }
        res.status(200).json({ message: "Seller deleted successfully", deletedSeller });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting Seller", deletedSeller });
    }
})


router.post("/seller/verify-otp",async(req,res)=>{
    try
   {
        const {otpToken,otp}=req.body;
        //verify token (email or otp se verify hoga)
        const decoded1= jwt.verify(otpToken,process.env.JWT_SECRET);
        if(!decoded1 || decoded1.otp !== otp)//decoded mei value tab nhi hogi jab token expire hogya hoga  
            {
return res.status(400).json({message:"INVALID OTP or token expires"});
            } 

            const email = decoded1.email;
            const Newuser = await Seller.findOne({email})
            Newuser.isEmailVerified = true;
            await Newuser.save();
            return res.status(200).json({message:"otp verified succesffuly",Newuser})
    }
    catch(err)
    {
   return res.status(500).json({message:"Bhai kch error aa gya "});     
    }
})


module.exports = router;