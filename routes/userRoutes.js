const express = require('express');
const User = require("../models/user")
const {sendEmail} = require("../config/emailConfig");
const jwt = require('jsonwebtoken');

 
const router = express.Router();//method for routing 
//cretae a routes for post 
router.post('/users',async(req,res)=>
{
    try
    {
        const {name,email,password,phone,dob}=req.body;
        const existingUser= await User.findOne({email});
        if(existingUser)
        {
            return res.status(400).json({message:"User Already exist"});
        }

        const newUser=new User ({name,email,password,dob,phone});
        await newUser.save();
//nodemailer
const mailOptions=
{ 

    
from:process.env.EMAIL_USER,
to:email,
subject:"Welcome to our e_Commerce Ayurveda platform",
text:`Hi,${name},Thankyou for registering in our app .Welcome to our platform.Hope you will like our Services`
}

const emailResult = await sendEmail(mailOptions);


        res.status(200).json({messgae:"HAHA,user registered successfully and email sent succesfully",emailResult}) 
        
        

    }
    catch(error)
    {
res.status(500).json({message:"Error creating User",error:error.message});
    }
});

router.get("/users",async(req,res)=>
    {
        try{
const users=await User.find();
res.status(200).json({users});
        }
        catch(error)
        {
            res.status(500).json({message:"ERRor Fetching users",error});
        }
        
    }
);

////

router.post("/user/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found. Please register first." });
        }

       

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful",token:token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});


router.get("/users/:id",async(req,res)=>
{
    try
    {
        const user=await User.findById(req.params.id);
        if(!user)
        {
            return res.status(404).json({message:"Useer not found"});
        }
        res.status(200).json(user);
    }
    catch(error)
    {
        res.status(500).json({message:"Error feetching User",error})
    }
});


router.put('/users/:id',async(req,res)=>
{
    try
    {
const userData =  await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
if(!userData)
{
    return res.status(404).json({message:"user not found"});

}
    res.status(200).json({message:"user found and updated succesfully",userData}); 
    
    }
    catch(error)
    {
        res.status(500).json({message:"Error feetching User",error})
    }

})


router.patch('/users/:id',async (req,res)=>
{
    try
    {
const userData = await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
if(!userData)
{
    return res.status(404).json({message:"User nnot found"});

}
res.status(200).json({message:"user found and updated succesfully",userData}); 
}
catch(error)
{
    res.status(500).json({message:"Error fetchiing user",error})
}
    
})




router.delete('/users/:id',async(req,res)=>
{
    try
    {
        const userData = await User.findByIdAndDelete(req.params.id,req.body,{new:true});
        if(!userData)
        {
            return res.status(404).json({message:"User nnot found"});
        
        }
        res.status(200).json({message:"user found and updated succesfully",userData}); 
    }
    catch(error)
    {
        res.status(500).json({message:"Error fetchiing user",error})
    }
    
    
})



module.exports= router;