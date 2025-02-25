import { Link } from 'react-router-dom';
import logo from '../../../assets/images/logo.png';
import HeaderSearch from './HeaderSearch';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Box,
  IconButton,
} from '@mui/material';

import {
  Person,
  ShoppingBagOutlined,
  Settings,
  Logout,
  LocalShipping,
  FavoriteOutlined,
} from '@mui/icons-material';

import Navigation from './Navigation';
import HeaderWarn from '../../ui/HeaderWarn';
import { useCart } from '../../../hooks/useCart';
import { useWishlist } from '../../../hooks/useWishlist';
import { useState } from 'react';
import MobileHeader from './MobileHeader';
import { useCategories } from '../../../hooks/useCategories';
import { Typography } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const [anchorEl, setAnchorEl] = useState(null);
  const { data: categories } = useCategories({
    limit: 10,
  });

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleProfileMenuClose();
  };

  // Calculate cart total
  const cartTotal =
    cart?.items?.reduce((total, item) => {
      if (!item?.product?._id || !item?.quantity) return total;
      return (
        total +
        (item.product.discountPrice || item.product.regularPrice) *
          parseInt(item.quantity)
      );
    }, 0) || 0;

  // Get cart items count
  const cartItemsCount =
    cart?.items?.reduce((total, item) => {
      // Only count valid items and their exact quantity (not adding to total)
      if (!item?.product?._id || !item?.quantity) return total;
      return total + 1; // Count each unique item as 1, not the quantity
    }, 0) || 0;

  // Get wishlist items count
  const wishlistItemsCount = wishlist?.products?.length || 0;

  return (
    <>
      <div className='headerWrapper'>
        <HeaderWarn message='Due to the COVID 19 epidemic, orders may be processed with a slight delay' />
        <div className='res-hide'>
          <header
            className='header'
            style={{
              boxSizing: 'border-box',
              margin: '0px',
              display: 'block',
              height: 'auto',
              width: '100%',
              padding: '10px 0px',
            }}
          >
            <div
              className='container'
              style={{
                boxSizing: 'border-box',
                margin: '0px',
                padding: '0px',
                marginLeft: 'auto',
                marginRight: 'auto',
                paddingLeft: '15px',
                paddingRight: '15px',
                width: '100%',
                maxWidth: '100%',
              }}
            >
              <div className='row'>
                <div className='logoWrapper d-flex align-items-center col-sm-2'>
                  <Link to='/'>
                    <img src={logo} alt='logo' />
                  </Link>
                </div>

                <div className='col-sm-10 d-flex align-items-center part2'>
                  <HeaderSearch />

                  <div className='part3 ml-auto d-flex align-items-center'>
                    {loading ? (
                      <div className='loading-placeholder' />
                    ) : isAuthenticated ? (
                      <>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                        >
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
                      </>
                    ) : (
                      <Link to='/login'>
                        <Button className='btn-blue btn-big btn-lg btn-round mr-3'>
                          Login / Register
                        </Button>
                      </Link>
                    )}

                    {/* Wishlist */}
                    <div className='cartTab d-flex align-items-center'>
                      <div className='position-relative ml-2 res-hide'>
                        <Link to='/wishlist'>
                          <Button className='circle'>
                            <FavoriteOutlined />
                          </Button>
                        </Link>
                        {wishlistItemsCount > 0 ? (
                          <span className='count d-flex align-items-center justify-content-center'>
                            {wishlistItemsCount}
                          </span>
                        ) : (
                          <span className='count d-flex align-items-center justify-content-center'>
                            {wishlistItemsCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cart */}
                    <div className='cartTab d-flex align-items-center'>
                      {cartTotal > 0 ? (
                        <span className='price ml-3'>{cartTotal} TK</span>
                      ) : (
                        <span className='price ml-3'>0.00 TK</span>
                      )}
                      <div className='position-relative ml-2 res-hide'>
                        <Link to='/cart'>
                          <Button className='circle'>
                            <ShoppingBagOutlined />
                          </Button>
                        </Link>
                        {cartItemsCount > 0 ? (
                          <span className='count d-flex align-items-center justify-content-center'>
                            {cartItemsCount}
                          </span>
                        ) : (
                          <span className='count d-flex align-items-center justify-content-center'>
                            {cartItemsCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <Navigation categories={categories} />
        </div>
      </div>
      <div className='res-show'>
        <MobileHeader categories={categories} />
      </div>

      {/* Profile Menu */}
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
};

export default Header;
