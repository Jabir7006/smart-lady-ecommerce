import React, { useState } from 'react';
import { Button, IconButton, Badge, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Menu as MenuIcon,
  ShoppingBagOutlined,
  Search as SearchIcon,
  FavoriteOutlined,
  Person,
  Close,
} from '@mui/icons-material';
import MobileSidebar from './Navigation/MobileSidebar';
import Drawer from '@mui/material/Drawer';
import logo from '../../../assets/images/logo.png';
import { useCart } from '../../../hooks/useCart';
import { useWishlist } from '../../../hooks/useWishlist';
import { useAuth } from '../../../context/AuthContext';
import HeaderSearch from './HeaderSearch';

export default function MobileHeader({ categories }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { isAuthenticated, user, logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
  };

  const toggleDrawer = (anchor, open) => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setIsOpen(open);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  // Calculate cart items count
  const cartItemsCount =
    cart?.items?.reduce((total, item) => {
      if (!item?.product?._id || !item?.quantity) return total;
      return total + 1;
    }, 0) || 0;

  // Get wishlist items count
  const wishlistItemsCount = wishlist?.products?.length || 0;

  return (
    <>
      <header className='mobile-header'>
        <div className='container'>
          <div className='mobile-header-content'>
            <div className='mobile-header-left'>
              <IconButton
                className='mobile-icon-btn'
                onClick={toggleDrawer('left', true)}
                size='small'
              >
                <MenuIcon fontSize='small' style={{ fontSize: '18px' }} />
              </IconButton>
              <Drawer
                anchor='left'
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className='mobile-sidebar-drawer'
              >
                <MobileSidebar categories={categories} />
              </Drawer>
            </div>

            <div className='mobile-header-center'>
              <Link to='/' className='mobile-logo'>
                <img src={logo} alt='Logo' />
              </Link>
            </div>

            <div className='mobile-header-right'>
              <IconButton
                className='mobile-icon-btn'
                onClick={toggleSearch}
                size='small'
              >
                <SearchIcon fontSize='small' style={{ fontSize: '18px' }} />
              </IconButton>

              <Link to='/wishlist' className='mobile-icon-link'>
                <IconButton className='mobile-icon-btn' size='small'>
                  <Badge
                    badgeContent={wishlistItemsCount}
                    color='error'
                    className='mobile-badge'
                    max={99}
                  >
                    <FavoriteOutlined
                      fontSize='small'
                      style={{ fontSize: '18px' }}
                    />
                  </Badge>
                </IconButton>
              </Link>

              <Link to='/cart' className='mobile-icon-link'>
                <IconButton className='mobile-icon-btn' size='small'>
                  <Badge
                    badgeContent={cartItemsCount}
                    color='error'
                    className='mobile-badge'
                    max={99}
                  >
                    <ShoppingBagOutlined
                      fontSize='small'
                      style={{ fontSize: '18px' }}
                    />
                  </Badge>
                </IconButton>
              </Link>

              {!loading && (
                <IconButton
                  className='mobile-icon-btn'
                  onClick={toggleProfile}
                  size='small'
                >
                  {isAuthenticated ? (
                    <Avatar
                      src={user?.avatar}
                      alt={user?.name}
                      className='mobile-avatar'
                      sx={{ width: 20, height: 20 }}
                    >
                      {user?.name?.charAt(0)}
                    </Avatar>
                  ) : (
                    <Person fontSize='small' style={{ fontSize: '18px' }} />
                  )}
                </IconButton>
              )}
            </div>
          </div>

          {/* Mobile Search Drawer */}
          <div className={`mobile-search-drawer ${searchOpen ? 'open' : ''}`}>
            <div className='mobile-search-header'>
              <IconButton
                className='close-search-btn'
                onClick={toggleSearch}
                size='small'
                aria-label='Close search'
              >
                <Close fontSize='small' style={{ fontSize: '18px' }} />
              </IconButton>
              <div className='mobile-search-input'>
                <HeaderSearch />
              </div>
            </div>
          </div>

          {/* Mobile Profile Drawer */}
          <div className={`mobile-profile-drawer ${profileOpen ? 'open' : ''}`}>
            <div className='mobile-profile-header'>
              <IconButton
                className='close-profile-btn'
                onClick={toggleProfile}
                size='small'
              >
                <Close fontSize='small' style={{ fontSize: '18px' }} />
              </IconButton>
              <h3>My Account</h3>
            </div>
            <div className='mobile-profile-content'>
              {isAuthenticated ? (
                <div className='mobile-profile-menu'>
                  <div className='mobile-profile-info'>
                    <Avatar
                      src={user?.avatar}
                      alt={user?.name}
                      className='mobile-profile-avatar'
                    >
                      {user?.name?.charAt(0)}
                    </Avatar>
                    <div className='mobile-profile-details'>
                      <h4>{user?.name}</h4>
                      <p>{user?.email}</p>
                    </div>
                  </div>
                  <div className='mobile-profile-links'>
                    <Link to='/profile' onClick={() => setProfileOpen(false)}>
                      My Profile
                    </Link>
                    <Link to='/orders' onClick={() => setProfileOpen(false)}>
                      My Orders
                    </Link>
                    <Link to='/wishlist' onClick={() => setProfileOpen(false)}>
                      My Wishlist
                    </Link>
                    <Link to='/address' onClick={() => setProfileOpen(false)}>
                      My Addresses
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='mobile-logout-btn'
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className='mobile-login-options'>
                  <p>Login to access your account</p>
                  <Link
                    to='/login'
                    className='mobile-login-btn'
                    onClick={() => setProfileOpen(false)}
                  >
                    Login / Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

    </>
  );
}
