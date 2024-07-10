import { usersSockets } from "../lib/helper.js";

const emitEvent=(req,event,users,data)=>{
    console.log("idhara aa bhir a",data);
    const io=req.app.get("io");
    const usersSocket=usersSockets(users);
    io.to(usersSocket).emit(event,data)
}

export { emitEvent };
