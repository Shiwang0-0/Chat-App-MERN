import { Avatar, AvatarGroup, Stack,Box } from '@mui/material'
import React from 'react'
import { transformImage } from '../../lib/fileFormat'

const AvatarCard = ({avatar=[], max=4}) => {
  return (
    <Stack direction={"row"} spacing={0.5}>
        <AvatarGroup max={max}>
            <Box sx={{width:"5rem", height:"2rem",  position: "relative"}} > 
            {avatar.map((src,index)=>(
                <Avatar 
                src={transformImage(src)} key={Math.random()*100} alt={`Avatar ${index}`} sx={{height:"2.2rem" ,width:"2.2rem",position: "absolute", 
                left:`${0.4 + index}rem`,
                right:`${0.4 + index}rem`,
                }}
                />
            ))}
            </Box>
        </AvatarGroup>
    </Stack>
  )
}

export default AvatarCard
