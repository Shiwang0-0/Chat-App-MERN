import mongoose,{ Schema, model, Types } from "mongoose";

const schema =new Schema({
    name:{
        type:String,
        required:true
    },
    groupChat:{
        type:Boolean,
        default:false,
    },
    groupAvatar:{
        public_id:{
            type:String,
        },
        url:{
            type:String,
        }
    },
    creator:{
        type:Types.ObjectId,
        ref:"User"
    },
    members:[
        {
            type:Types.ObjectId,
            ref:"User"
        }
    ]
},
{
    timestamps:true
});

export const Chat=mongoose.models.Chat || model("Chat",schema)

