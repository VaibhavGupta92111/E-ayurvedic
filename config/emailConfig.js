const nodemailer = require('nodemailer');

//create transport (funaction for which mail gone)

const transporter = nodemailer.createTransport({

    service:"gmail",
//service--gmail,yahoo,outllok

auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS,
}


})


// function for mailing the email

const sendEmail = async(mailOptions)=>
{
 try
 {
const info = await transporter.sendMail(mailOptions);
return{success:true,response:info.response}


 }  
 catch(err)
 {
return{success:false, error:err};
//res.emnd vala bhi likh sakte haiii
 } 
}


module.exports={sendEmail}


// mailoptions ->
// kisko mail send karni haii 
// kya mail bjeni ahii
// lisle through mail ja rhi haiii,
// kya sub aii hoga vo