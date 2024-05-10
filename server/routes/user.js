import express from "express";
import { login, newUser } from "../controllers/user.js";
import { multerSingleAvatar} from "../middlewares/multer.js";

const app=express.Router();

app.post("/new",multerSingleAvatar,newUser);

app.get("/login",login);

export default app;