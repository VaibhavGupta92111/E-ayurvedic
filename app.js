const connectDB = require("./config/db");

const express = require('express'); 
const cors=require('cors')


const routes = require("./routes/userRoutes");

const Sellerroutes = require("./routes/SellerRoutes");
const ProductRoutes = require("./routes/ProductRoutes"); // Ensure correct relative path
 const OrderRoutes = require("./routes/OrderRoutes");
// const payment = require("./routes/PaymentRoute")


require ('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors())

connectDB();
app.get('/',(req,res)=>
{
    res.end("hello brother gyus hwxhxioxjwxgkwjxwxvkwx");

})

app.use('/api',routes);//today
app.use('/api',Sellerroutes);//today
app.use('/api',ProductRoutes); //today
app.use('/api',OrderRoutes); //today
// app.use('/api',payment);
app.listen(3005,()=>
{
    console.log("server is running on the port 3005");
    
})