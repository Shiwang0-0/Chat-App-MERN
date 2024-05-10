import multer from "multer"

export const multerUpload=multer({
    limits:{
        fileSize:1024*1024*4
    }
});

const multerSingleAvatar=multerUpload.single("avatar");

export {multerSingleAvatar}