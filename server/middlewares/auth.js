import { TOKEN } from "../constants/config.js";
import { User } from "../models/user.js";
import { customError, tryCatch } from "./error.js";
import jwt from "jsonwebtoken";

const isAuthenticated =tryCatch((req,res,next)=>{

    const token=req.cookies[TOKEN];
    
    if(!token)
        return next(new customError("Login required",401))

    const decodedToken=jwt.verify(token,process.env.JWT_SECRET)

    if(!decodedToken)
        return next(new customError("User not Authorized",401))

    req.user=decodedToken;
    next();
})


const socketAuthenticator=async(err,socket,next)=>{

    try{
        if(err)
            return next(customError("Please Login to access this route",401));
    
        const authToken=socket.request.cookies[TOKEN];
    
        if(!authToken)
            return next(customError("Please Login to access this route",401));
    
        const decodedData=jwt.verify(authToken,process.env.JWT_SECRET)
    
        const user=await User.findById(decodedData._id);
    
        if(!user)
            return next(customError("User does not exist",401));
    
        socket.user=user;
        return next();
    }
    catch(error)
    {
        return next(error);
    }
}

export {isAuthenticated,socketAuthenticator};