import express from "express";
import { login, newUser, myProfile, logout } from "../controllers/user.js";
import { multerSingleAvatar} from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app=express.Router();

app.post("/new",multerSingleAvatar,newUser);

app.post("/login",login);

app.use(isAuthenticated);

app.get("/me",myProfile);

app.get("/logout",logout);

export default app;