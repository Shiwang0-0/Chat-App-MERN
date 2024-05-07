import express from "express";
import userRoute from "./routes/user.js"
import { connectDB } from "./utils/database.js";
import dotenv from "dotenv";

const app=express();

dotenv.config({
    path:"./.env"
});

const uri=process.env.MONGO_URI;
const port=process.env.PORT || 3000;

connectDB(uri);

app.use("/user",userRoute);

app.get("/",(req,res)=>{
    res.send("Welcome to Home")
})

app.listen(port,()=>
    {
        console.log("connected",3000);
    })