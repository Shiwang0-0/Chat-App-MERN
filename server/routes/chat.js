import express from "express";
import { addMembers, chatMessages, createGroup, deleteChats, getChatDetail, getMyChats, getMyGroups, leaveGroup, removeMembers, renameGroup, sendAttachment } from "../controllers/chat.js";
import { addMemberValidator, chatIdInParamValidator, createGroupValidator, removeMemberValidator, renameGroupValidator, sendAttachmentValidator, validationHandler, } from "../lib/validators.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { multerAttachments } from "../middlewares/multer.js";

const app=express.Router();

app.use(isAuthenticated);

app.post("/newgroup", createGroupValidator(), validationHandler, createGroup);

app.get("/mychat",getMyChats);
app.get("/mygroups",getMyGroups);

app.put("/addmembers", addMemberValidator(), validationHandler, addMembers);
app.put("/removemembers", removeMemberValidator(), validationHandler, removeMembers);

app.delete("/leave/:id", chatIdInParamValidator(), validationHandler, leaveGroup);

app.post("/message",multerAttachments, sendAttachmentValidator(), validationHandler, sendAttachment);
app.get("/message/:id", chatIdInParamValidator(), validationHandler, chatMessages);

app.route("/:id").get(chatIdInParamValidator(), validationHandler, getChatDetail).put(renameGroupValidator(), validationHandler, renameGroup).delete(chatIdInParamValidator(), validationHandler, deleteChats)

export default app;