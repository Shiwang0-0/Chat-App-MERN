import express from "express";
import { addMembers, createGroup, getMyChats, getMyGroups, removeMembers, leaveGroup } from "../controllers/chat.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app=express.Router();

app.use(isAuthenticated);

app.post("/newgroup",createGroup);

app.get("/mychat",getMyChats);
app.get("/mygroups",getMyGroups);

app.put("/addmembers",addMembers);
app.put("/removemembers",removeMembers);

app.delete("/leave/:id",leaveGroup);

export default app;