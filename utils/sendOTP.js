const crypto = require("crypto");
const nodemailer = require("nodemailer");

//otp genterte funcion

const generateOTP = ()=>
    {
        return crypto.randomInt(100000,999999).toString();
    } 

    const sendemail = async (email,otp)=>
    {
        const transpoter= nodemailer.createTransport({
            service:"gmail",
            auth:
            {
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS,
            }
        })

        const mailOptions =
        {
            from:process.env.EMAIL_USER,
            to:email,
            subject:"OTP verifiction realted mail",
            text:`your otp  for email verification is:${otp}.This otp is for 10 minutes`
        }
        await transpoter.sendMail(mailOptions);
    }

    module.exports ={generateOTP,sendemail};

   