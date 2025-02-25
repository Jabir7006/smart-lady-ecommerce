import { Link } from 'react-router-dom';
import logo from '../../../assets/images/logo.png';
import HeaderSearch from './HeaderSearch';
import { Button, Badge, IconButton, Container } from '@mui/material';

import { ShoppingBagOutlined, FavoriteOutlined } from '@mui/icons-material';

import Navigation from './Navigation';
import HeaderWarn from '../../ui/HeaderWarn';
import { useCart } from '../../../hooks/useCart';
import { useWishlist } from '../../../hooks/useWishlist';
import { useState } from 'react';
import MobileHeader from './MobileHeader';
import { useCategories } from '../../../hooks/useCategories';
import { useAuth } from '../../../context/AuthContext';
import ProfileMenu from './ProfileMenu';

const Header = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { data: categories } = useCategories({
    limit: 10,
  });

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
        <HeaderWarn />
        <div className='res-hide'>
          <header className='header'>
            <Container>
              <div className='header-content'>
                <div className='header-left'>
                  <Link to='/' className='logo-wrapper'>
                    <img src={logo} alt='logo' />
                  </Link>
                </div>

                <div className='header-center'>
                  <HeaderSearch />
                </div>

                <div className='header-right'>
                  {loading ? (
                    <div className='loading-placeholder' />
                  ) : isAuthenticated ? (
                    <ProfileMenu user={user} handleLogout={logout} />
                  ) : (
                    <Link to='/login'>
                      <Button className='btn-blue btn-big btn-round login-btn'>
                        Login / Register
                      </Button>
                    </Link>
                  )}

                  {/* Wishlist */}
                  <div className='header-icon-wrapper'>
                    <Link to='/wishlist'>
                      <IconButton className='header-icon-btn'>
                        <Badge
                          badgeContent={wishlistItemsCount}
                          color='error'
                          className='header-badge'
                        >
                          <FavoriteOutlined />
                        </Badge>
                      </IconButton>
                    </Link>
                  </div>

                  {/* Cart */}
                  <div className='header-icon-wrapper'>
                    {cartTotal > 0 && (
                      <span className='cart-total'>{cartTotal} TK</span>
                    )}
                    <Link to='/cart'>
                      <IconButton className='header-icon-btn'>
                        <Badge
                          badgeContent={cartItemsCount}
                          color='error'
                          className='header-badge'
                        >
                          <ShoppingBagOutlined />
                        </Badge>
                      </IconButton>
                    </Link>
                  </div>
                </div>
              </div>
            </Container>
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
