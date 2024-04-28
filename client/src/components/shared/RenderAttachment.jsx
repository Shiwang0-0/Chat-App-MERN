import React from 'react'
import {FileOpen} from "@mui/icons-material"
import { transformImage } from '../../lib/fileFormat';

const RenderAttachment = ({file,url}) => {
    switch (file) {
        case "video":
            return <video src={transformImage(url,200)}  preload='none' width={"200px"} height={"150px"} controls></video>
    
        case "image":
            return <img src={transformImage(url,200)}  width={"200px"} height={"150px"} controls style={{
                objectFit:"contain" 
            }}/>
    
        
        case "audio":
            return <audio src={url}  preload='none'controls></audio>
        
        default:
            return <FileOpen/>;
    }
}


export default RenderAttachment
