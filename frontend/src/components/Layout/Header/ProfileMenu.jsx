import { useState } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Person,
  ShoppingBagOutlined,
  Settings,
  Logout,
  LocalShipping,
  FavoriteOutlined,
} from '@mui/icons-material';

export default function ProfileMenu({ user, handleLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          onClick={handleProfileMenuOpen}
          sx={{
            padding: 0.5,
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
          }}
        >
          <Avatar
            src={user?.avatar?.url}
            alt={user?.fullName}
            sx={{
              width: 35,
              height: 35,
              bgcolor: 'primary.main',
              fontSize: '1.2rem',
            }}
          >
            {user?.fullName?.charAt(0)}
          </Avatar>
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 2,
          sx: {
            width: 250,
            mt: 1.5,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant='subtitle1' noWrap>
            {user?.fullName}
          </Typography>
          <Typography variant='body2' color='text.secondary' noWrap>
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem component={Link} to='/profile'>
          <ListItemIcon>
            <Person fontSize='small' />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to='/profile/orders'>
          <ListItemIcon>
            <ShoppingBagOutlined fontSize='small' />
          </ListItemIcon>
          <ListItemText>My Orders</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to='/wishlist'>
          <ListItemIcon>
            <FavoriteOutlined fontSize='small' />
          </ListItemIcon>
          <ListItemText>Wishlist</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to='/profile/track-orders'>
          <ListItemIcon>
            <LocalShipping fontSize='small' />
          </ListItemIcon>
          <ListItemText>Track Orders</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to='/profile/settings'>
          <ListItemIcon>
            <Settings fontSize='small' />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Logout fontSize='small' color='error' />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}