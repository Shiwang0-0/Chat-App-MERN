import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import { Backdrop } from '@mui/material';
import { Box } from '@mui/system';
import React, { Suspense, lazy, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { royalBlue } from '../../constants/colors';
import { resetNotificationCount } from '../../redux/reducers/chat';
import { setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/others.';
import { NavigationBars } from '../shared/NavigationBars';
import { bgColorPanel } from '../../constants/colors';

const SearchDialog = lazy(() => import("../specific/SearchDialog"));
const NotificationDialog = lazy(() => import("../specific/NotificationDialog"));
const NewGroupDialog = lazy(() => import("../specific/NewGroupDialog"))

const NavigationPanel = () => {

    const navigate = useNavigate();

    const [isMobile, setIsMobile] = useState(false);

    const dispatch = useDispatch();
    const { isNotification, isNewGroup, isSearch } = useSelector((state) => state.misc)

    const handleMobile = () => {
        setIsMobile((prev) => !prev);
    }

    const navigateToHome = () => navigate("/");

    const searchDialog = () => dispatch(setIsSearch(true))

    const openNotifications = () => {
        dispatch(setIsNotification(true))
        dispatch(resetNotificationCount())
    }

    const navigateToGroups = () => navigate("/group")


    const createGroup = () => dispatch(setIsNewGroup(true))


    const navigateToProfile = () => navigate("/profile")


    return (
        <>
            <Box sx={{ bgcolor:bgColorPanel, height: '90vh', display: "flex", flexDirection: "column", alignItems: "center", mt: "10px", ml: "5px", mr: "5px", overflow: "none",borderRadius:"20px 20px 20px 20px" }} >

                <NavigationBars title={"Home"} icon={<HomeIcon />} onClickfunc={navigateToHome} />
                <NavigationBars title={"Search"} icon={<SearchIcon />} onClickfunc={searchDialog} />
                <NavigationBars title={"Notifications"} icon={<NotificationsNoneIcon />} onClickfunc={openNotifications} />
                <NavigationBars title={"Groups"} icon={<GroupsIcon />} onClickfunc={navigateToGroups} />
                <NavigationBars title={"Create Group"} icon={<GroupAddIcon />} onClickfunc={createGroup} />
                <NavigationBars title={"Profile"} icon={<AccountCircleIcon />} onClickfunc={navigateToProfile} />
            </Box>

            {isSearch && (
                <Suspense fallback={<Backdrop open />}>
                    <SearchDialog />
                </Suspense>
            )}
            {isNotification && (
                <Suspense fallback={<Backdrop open />}>
                    <NotificationDialog />
                </Suspense>
            )}
            {isNewGroup && (
                <Suspense fallback={<Backdrop open />}>
                    <NewGroupDialog />
                </Suspense>
            )}

        </>
    )
}



export default NavigationPanel
