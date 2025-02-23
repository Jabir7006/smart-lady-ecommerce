import { Link } from 'react-router-dom';
import logo from '../../../assets/images/logo.png';
import HeaderSearch from './HeaderSearch';
import { Button, Menu, MenuItem } from '@mui/material';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { IoBagOutline } from 'react-icons/io5';

import Navigation from './Navigation';
import HeaderWarn from '../../ui/HeaderWarn';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../hooks/useCart';
import { useWishlist } from '../../../hooks/useWishlist';
import { useState } from 'react';
import { IoMdHeartEmpty } from 'react-icons/io';
import MobileHeader from './MobileHeader';
import { useCategories } from '../../../hooks/useCategories';

const Header = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const [anchorEl, setAnchorEl] = useState(null);
  const { data: categories } = useCategories({
    limit: 10,
  });

  const handleProfileClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
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
                    <img
                      src='http://localhost:5173/src/assets/images/logo.png'
                      alt='logo'
                    />
                  </Link>
                </div>

                <div className='col-sm-10 d-flex align-items-center part2'>
                  <HeaderSearch />

                  <div className='part3 ml-auto d-flex align-items-center'>
                    {loading ? (
                      <div className='loading-placeholder' />
                    ) : isAuthenticated ? (
                      <>
                        <Button className='circle' onClick={handleProfileClick}>
                          <FiUser />
                        </Button>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                        >
                          <MenuItem>
                            <span className='user-name'>{user?.fullName}</span>
                          </MenuItem>
                          <MenuItem
                            component={Link}
                            to='/profile'
                            onClick={handleClose}
                          >
                            Profile
                          </MenuItem>
                          <MenuItem onClick={handleLogout}>
                            <FiLogOut className='mr-2' /> Logout
                          </MenuItem>
                        </Menu>
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
                            <IoMdHeartEmpty />
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
                            <IoBagOutline />
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
    </>
  );
};

export default Header;
