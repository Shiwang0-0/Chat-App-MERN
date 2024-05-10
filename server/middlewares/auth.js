import { customError } from "./error.js";
import jwt from "jsonwebtoken";

const isAuthenticated =(req,res,next)=>{

    const token=req.cookies["val-token"];
    
    if(!token)
        return next(new customError("Login required",401))

    const decodedToken=jwt.verify(token,process.env.JWT_SECRET)

    if(!decodedToken)
        return next(new customError("User not Authorized",401))

    req.user=decodedToken;
    next();
}

export {isAuthenticated};