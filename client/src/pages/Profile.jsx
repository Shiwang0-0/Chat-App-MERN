import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { bgColorProfileCard } from '../constants/colors';
import { transformImage } from '../lib/fileFormat';

const Profile = ({ user }) => {
  const createdAt = new Date(user?.createdAt);
  const joined = `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`;
  console.log(user)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{
        mt: '50px',
        height: '450px',
        width: '60%',
        backgroundColor: bgColorProfileCard,
        borderRadius: '40px',
        padding: '20px',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={transformImage([user?.avatar?.url])} sx={{ height: '150px', width: '150px', objectFit: 'contain', mr: 2,border:"2px solid white"}} />
          <Box sx={{ width: '60%' }}>
          < ProfileCard  text={user?.name} icon={<PersonIcon/>} />
            <ProfileCard heading="Username" text={user?.username} icon={<AssignmentIndIcon />} />
          </Box>
        </Box>
        <ProfileCard heading="Joined" text={joined} icon={<CalendarMonthIcon />} />
      </Box>
    </Box>
  );
};

const ProfileCard = ({ heading, text, icon }) => {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      padding: '1rem',
      borderBottom: '1px solid #444',
      '&:last-child': {
        borderBottom: 'none',
      },
    }}>
      {icon && <Box sx={{ marginRight: '0.3rem',marginTop:'5px' }}>{icon}</Box>}
      <Stack>
        <Typography sx={{ color: 'white', fontSize: '1.2rem' }}>{text}</Typography>
        <Typography sx={{ color: 'gray', fontSize: '0.9rem' }}>{heading}</Typography>
      </Stack>
    </Box>
  );
};

export default AppLayout()(Profile);