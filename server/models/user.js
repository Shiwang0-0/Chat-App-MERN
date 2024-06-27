import { hash } from "bcrypt";
import mongoose, { Schema, model } from "mongoose";

const schema =new Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    bio:{
        type:String
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    avatar:{
        public_id:{
            type:String,
        },
        url:{
            type:String,
        }
    }
},
{
    timestamps:true
});

schema.pre("save",async function(){
    
    if(!this.isModified("password")) 
        return next();

    this.password=await hash(this.password,10);
})

export const User=mongoose.models.User || model("User",schema)

