import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../hooks/useUser';
import { useOrder } from '../../hooks/useOrder';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Box,
  Button,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import {
  Person,
  Email,
  ShoppingBag,
  Favorite,
  LocalShipping,
  Settings,
  NavigateNext,
  Edit,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import AddressList from '../../components/AddressList';

const Profile = () => {
  const { user } = useAuth();
  const { profile, isLoading } = useUser();
  const { orders } = useOrder();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatDate = dateString => {
    try {
      if (!dateString) return 'N/A';
      return format(parseISO(dateString), 'MMMM yyyy');
    } catch (error) {
      return 'N/A';
    }
  };

  const quickLinks = [
    {
      icon: <ShoppingBag />,
      label: 'My Orders',
      path: '/profile/orders',
      count: orders?.length || '0',
    },
    {
      icon: <LocalShipping />,
      label: 'Track Orders',
      path: '/profile/track-orders',
    },
    {
      icon: <Settings />,
      label: 'Settings',
      path: '/profile/settings',
    },
  ];

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'primary.main',
              color: 'white',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <IconButton
              component={Link}
              to='/profile/settings'
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              <Edit />
            </IconButton>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                border: '4px solid white',
                boxShadow: 2,
                bgcolor: 'secondary.main',
                fontSize: '3rem',
              }}
            >
              {profile?.fullName?.charAt(0)}
            </Avatar>
            <Typography variant='h5' gutterBottom>
              {profile?.fullName}
            </Typography>
            <Typography variant='body2' sx={{ opacity: 0.8 }}>
              Member since {formatDate(profile?.createdAt)}
            </Typography>
          </Paper>

          {/* Quick Links */}
          <Paper sx={{ mt: 3, borderRadius: 2 }}>
            <List>
              {quickLinks.map((link, index) => (
                <ListItem
                  key={link.label}
                  component={Link}
                  to={link.path}
                  sx={{
                    py: 2,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    borderBottom:
                      index < quickLinks.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    {link.icon}
                  </ListItemIcon>
                  <ListItemText primary={link.label} />
                  {link.count && (
                    <Chip
                      size='small'
                      label={link.count}
                      color='primary'
                      sx={{ mr: 2 }}
                    />
                  )}
                  <ListItemSecondaryAction>
                    <NavigateNext color='action' />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange} sx={{ px: 2 }}>
                <Tab label='Personal Information' />
                <Tab label='Addresses' />
              </Tabs>
            </Box>

            {/* Personal Information */}
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography
                      variant='subtitle2'
                      color='text.secondary'
                      gutterBottom
                    >
                      Full Name
                    </Typography>
                    <Typography variant='body1'>{profile?.fullName}</Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant='subtitle2'
                      color='text.secondary'
                      gutterBottom
                    >
                      Email Address
                    </Typography>
                    <Typography variant='body1'>{profile?.email}</Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant='subtitle2'
                      color='text.secondary'
                      gutterBottom
                    >
                      Role
                    </Typography>
                    <Chip
                      label={profile?.role}
                      color={profile?.role === 'admin' ? 'error' : 'primary'}
                      size='small'
                    />
                  </Box>
                  <Button
                    variant='outlined'
                    color='primary'
                    startIcon={<Edit />}
                    component={Link}
                    to='/profile/settings'
                  >
                    Edit Profile
                  </Button>
                </Stack>
              </Box>
            )}

            {/* Addresses */}
            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <AddressList />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
