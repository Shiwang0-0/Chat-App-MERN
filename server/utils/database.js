import mongoose from "mongoose"

const connectDB=(uri)=>{
    mongoose.connect(uri,{dbName:"ChatApp"})
    .then((data)=>{
        console.log("Connected to Database")
    })
    .catch((err)=>{
        throw(err)
    })
}

export {connectDB}