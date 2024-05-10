import express from "express";
import userRoute from "./routes/user.js"
import { connectDB } from "./utils/database.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";

const app=express();

dotenv.config({
    path:"./.env"
});

const uri=process.env.MONGO_URI;
const port=process.env.PORT || 3000;

connectDB(uri);

app.use(express.json());

app.use("/user",userRoute);

app.get("/",(req,res)=>{
    res.send("Welcome to Home")
})

app.use(errorMiddleware)

app.listen(port,()=>
    {
        console.log("connected",3000);
    })