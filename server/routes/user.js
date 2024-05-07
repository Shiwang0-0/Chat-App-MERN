import express from "express";
import { login, newUser } from "../controllers/user.js";

const app=express.Router();

app.get("/new",newUser);

app.get("/login",login);

export default app;