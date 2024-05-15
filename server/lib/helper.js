export const getOtherMember=(members,userId)=>{
    return members.find((members)=>members._id.toString()!==userId.toString());
}