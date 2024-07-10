import { AudioFile as AudioFileIcon, Image as ImageIcon, UploadFile as UploadFileIcon, VideoFile as VideoFileIcon } from '@mui/icons-material';
import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material';
import React, { useRef } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useSendAttachmentsMutation } from '../../redux/api/api';
import { setIsFileMenu, setIsUploadingLoader } from '../../redux/reducers/others.';

const AttachmentDialog = ({anchorEl,chatId}) => {

    const dispatch=useDispatch()
    const imageRef=useRef(null);
    const audioRef=useRef(null);
    const videoRef=useRef(null);
    const fileRef=useRef(null);

    const {isFileMenu}=useSelector((state)=>state.misc);

    const [sendAttachments]=useSendAttachmentsMutation();

    const closeFileMenu=()=>{
        dispatch(setIsFileMenu(false));
    }

    const selectImage=()=>imageRef.current?.click();
    const selectAudio=()=>audioRef.current?.click();
    const selectVideo=()=>videoRef.current?.click();
    const selectFile=()=>fileRef.current?.click();

    const fileChangeHandler=async (e,key)=>{
        const files=Array.from(e.target.files);

        if(files.length<=0)
            return;

        if(files.length>5)
           return toast.error(`Can't upload more than 5 ${key} at a time`)

        dispatch(setIsUploadingLoader(true))

        const toastId=toast.loading(`Sending ${key} ...`)
        closeFileMenu();

        try{
            const myForm=new FormData();
            myForm.append("chatId",chatId)
            files.forEach((file)=>myForm.append("files",file))

            const res=await sendAttachments(myForm);
            console.log(res)
            if(res.data)
            {
                toast.success(`${key} sent successfully`,{id:toastId})
            }
            else{
                toast.error(`failed to send ${key}`,{id:toastId})
            }
        }
        catch(error)
        {
            toast.error(error,{id:toastId})
        }
        finally{
            dispatch(setIsUploadingLoader(false))
        }
    }

    return (
    <Menu anchorEl={anchorEl} open={isFileMenu} onClose={closeFileMenu}>
       <div style={{width:"10rem"}}>
       <MenuList>
            <MenuItem onClick={selectImage}>
            <Tooltip title="image">
                <ImageIcon/>
            </Tooltip>
            <ListItemText>Image</ListItemText>
            <input type="file" multiple accept="image/png, image/jpeg, image/gif" style={{display:"none"}} onChange={(e)=>fileChangeHandler(e,"Images")} ref={imageRef}/>
            </MenuItem>

            <MenuItem onClick={selectAudio}>
            <Tooltip title="audio">
                <AudioFileIcon/>
            </Tooltip>
            <ListItemText>Audio</ListItemText>
            <input type="file" multiple accept="audio/*" style={{display:"none"}} onChange={(e)=>fileChangeHandler(e,"Audios")} ref={audioRef}/>
            </MenuItem>

            <MenuItem onClick={selectVideo}>
            <Tooltip title="video">
                <VideoFileIcon/>
            </Tooltip>
            <ListItemText>Video</ListItemText>
            <input type="file" multiple accept="video/*" style={{display:"none"}} onChange={(e)=>fileChangeHandler(e,"videos")} ref={videoRef}/>
            </MenuItem>

            <MenuItem onClick={selectFile}>
            <Tooltip title="file">
                <UploadFileIcon/>
            </Tooltip>
            <ListItemText>File</ListItemText>
            <input type="file" multiple accept="*" style={{display:"none"}} onChange={(e)=>fileChangeHandler(e,"Files")} ref={fileRef}/>
            </MenuItem>

        </MenuList>
       </div>
    </Menu>
  )
}

export default AttachmentDialog
