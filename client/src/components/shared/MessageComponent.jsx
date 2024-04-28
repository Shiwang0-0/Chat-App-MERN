import { Typography, Box } from '@mui/material';
import React, {memo} from 'react'
import moment from "moment"
import { fileFormat } from '../../lib/fileFormat';
import {RenderAttachment }from './RenderAttachment';


const MessageComponent = ({message,user}) => {
    const {attachments,content,sender,createdAt}=message; 
    const sameSender=sender?._id==user?._id;
    const timeAgo=moment(createdAt).fromNow();
    return (
        <div
        style={{
            alignSelf:sameSender?'flex-end':'flex-start'
        }}>

        {!sameSender && <Typography color="black">{sender.name}</Typography>}

        {content && <Typography color="orange">{content}</Typography>}

        {
            attachments.length>0 && attachments.map((i,index)=>{
                const url=i.url;
                const file=fileFormat(url);
                return (
                    <Box key={index}>
                        <a 
                        href={url}
                        target="_blank"
                        download>
                        <RenderAttachment file={file} url={url} />
                        </a>
                    </Box>
                )   
            })
        }

        {<Typography>{timeAgo}</Typography>}
        </div>
  )
}

export default memo(MessageComponent)
