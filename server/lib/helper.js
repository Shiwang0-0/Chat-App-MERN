import { usersSocketIds } from "../app.js";

export const getOtherMember=(members,userId)=>{
    return members.find((members)=>members._id.toString()!==userId.toString());
}

export const usersSockets=(members=[])=>{
    const sockets=members.map((i)=>usersSocketIds.get(i._id.toString()))

    return sockets;
}

export const toBase64 = (file) => {
    if (file && file.buffer) {
        return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
    } else {
        console.error("File buffer is undefined or null");
    }
};
