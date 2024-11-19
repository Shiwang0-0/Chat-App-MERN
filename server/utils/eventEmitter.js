import { usersSockets } from "../lib/helper.js";

const emitEvent=(req,event,users,data)=>{
    const io=req.app.get("io");
    const usersSocket=usersSockets(users);
    io.to(usersSocket).emit(event,data)
}

export { emitEvent };
