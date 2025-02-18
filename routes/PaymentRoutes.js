const express =  require('express');

const razorpay =  require("../config/Razorpay");

const Order = require("../models/Order");


const router = express.Router();

router.post("/create-order",async(req,res)=>
{
    try{
        const {amount,currency}= req.body;

        const options =
        {
amount:amount * 100,
currency:currency || "INR",
receipt:`order_rcpt_${Math.random()}`
        }
const order = await razorpay.orders.create(options);
return res.status(200).json({messge:"Whoo,payment request generated successfully",order})

    }
    catch(error)
    {
return res.status(500).json({message:"An errroe occured try again please"})
    }
})

module.exports = router;