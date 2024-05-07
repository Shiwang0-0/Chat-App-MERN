import { User } from "../models/user.js"

const newUser=async(req,res)=>{

    const avatar={
        public_id:"sdfsdf",
        url:"Sfsdf"
    }

    const user= await User.create({
        name:"chonky",
        username:"chonky_cat",
        password:"cat",
        avatar
    })

    res.status(201).json({message:"user created successfully"})
}

const login=(req,res)=>{
    res.send("helo")
}

export {login,newUser};