import { Box,IconButton,Typography } from "@mui/material"
import { random } from "../../constants/colors"

export const NavigationBars=({title,icon,onClickfunc})=>{
    return (
     <Box sx={{mt:"15px",bgcolor:random,borderRadius:"6px",width:"70%",height:"40px",display: 'flex', alignItems: 'center', justifyContent: 'center'}} >
     <IconButton onClick={onClickfunc}>
         {icon}
     </IconButton>
     <Typography sx={{textAlign: 'center'}} >
         {title}
     </Typography>   
     </Box>
    )
 }