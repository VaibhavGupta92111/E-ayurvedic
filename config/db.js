const mongoose = require('mongoose');


require('dotenv').config();
//.env se mongoouri ko use karne k liye


const connectDB = async ()=>
{
    try
    {

    await  mongoose.connect(process.env.MONGO_URI,
    {
useNewUrlParser:true,//new url k changemet hoge vo change handle karege 
useUnifiedTopology:true,//
    });
    console.log("MONGODB CONNECTED SUCESSFULLY");
    
    }

    catch(error)
    {
        console.error("MONGODB connectuion failed",error);
        process.exit(1);  
    }
}

module.exports= connectDB;

//3AWOe7HRjwrsrhvG