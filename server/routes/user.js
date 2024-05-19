import express from "express";
import { acceptFriendRequest, availableFriends, login, logout, myProfile, newUser, notifications, searchUser, sendFriendRequest } from "../controllers/user.js";
import { loginValidator, registerValidator, requestAcceptorValidator, requestSenderValidator, validationHandler } from "../lib/validators.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { multerSingleAvatar } from "../middlewares/multer.js";

const app=express.Router();

app.post("/new",multerSingleAvatar, registerValidator(), validationHandler, newUser);

app.post("/login", loginValidator(), validationHandler, login);

app.use(isAuthenticated);

app.get("/me",myProfile);

app.get("/logout",logout);

app.get("/search",searchUser);

app.post("/request",requestSenderValidator(), validationHandler, sendFriendRequest);
app.post("/handlerequest",requestAcceptorValidator(), validationHandler, acceptFriendRequest);
app.get("/notifications",notifications);

app.get("/friends",availableFriends);

export default app;