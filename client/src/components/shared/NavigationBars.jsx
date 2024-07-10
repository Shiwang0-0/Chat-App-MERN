import { Badge, Box, IconButton, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import { bgColorBar, iconColor } from "../../constants/colors"

export const NavigationBars = ({ title, icon, onClickfunc }) => {
     const { notificationCount } = useSelector((state) => state.chat)
     return (
          <Box sx={{ mt: "30px", bgcolor: bgColorBar, borderRadius: "20px", width: "70%", height: "40px", display: 'flex', alignItems: 'center', justifyContent: 'center', '&:hover': {bgcolor: 'black',borderRadius: '20px',color: 'white', 
          '& > *': {'&.MuiIconButton-root': { color: 'white' }}}
          }}>
               <IconButton onClick={onClickfunc} sx={{ color: iconColor }}>
                    {
                         notificationCount && title === "Notifications" ? (
                              <Badge badgeContent={notificationCount} color="error">{icon}</Badge>
                         ) : icon
                    }
               </IconButton>
               <Typography sx={{ textAlign: 'center' }}>
                    {title}
               </Typography>
          </Box>
     )
}