import multer from "multer"

export const multerUpload=multer({
    limits:{
        fileSize:1024*1024*4
    }
});

const multerSingleAvatar=multerUpload.single('avatar');

const multerAttachments=multerUpload.array("files",5);

export {multerSingleAvatar, multerAttachments}