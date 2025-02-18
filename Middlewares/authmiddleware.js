const jwt = require("jsonwebtoken");


const authMiddleware=(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(authHeader && authHeader.startsWith('Bearer '))
    {
        const token = authHeader.split(' ')[1]

        try
        {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        //if succesfuuly verified then value will be stored in decoed

        req.user= decoded
        next();


        }

        catch(error)
        {
            return res.status(401).json({message:"Inavalid token"});
        }


    }
    else
    {
return res.status(401).json({message:"No token Provided,authorization denied"})
    }



}

module.exports = authMiddleware;