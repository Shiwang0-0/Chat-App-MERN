import { usersSocketIds } from "../app.js";

export const getOtherMember=(members,userId)=>{
    return members.find((members)=>members._id.toString()!==userId.toString());
}

export const usersSockets=(members=[])=>{
    const sockets=members.map((i)=>usersSocketIds.get(i._id.toString()))

    return sockets;
}