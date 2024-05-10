import { compare } from "bcrypt";
import { User } from "../models/user.js"
import { sendtoken } from "../utils/token.js";
import { tryCatch } from "../middlewares/error.js";
import { customError } from "../middlewares/error.js";

const newUser=tryCatch(async(req,res)=>{

    const {name,username,password}=req.body;

    const avatar={
        public_id:"sdfsdf",
        url:"Sfsdf"
    }

    const user= await User.create({name,username,password,avatar});
    if(!user)
        return next(new customError("Error, Please try again",500));

    sendtoken(res,user,201,"User created")
})

const login = tryCatch(async(req,res,next)=>{
    
        const {username,password}=req.body;
        const user=await User.findOne({username}).select("+password");
    
        if(!user)
            return next(new customError("Invalid Credentials",401));
    
        const isPassword=await compare(password,user.password);
    
        if(!isPassword)
            return next(new customError("Invalid Credentials",401));
    
        sendtoken(res,user,201,"User Logged in")   
})

export {login,newUser};