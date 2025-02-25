import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Rating,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QuantityBox from '../../components/Home/QuantityBox';
import { useCart } from '../../hooks/useCart';
import ThemedSuspense from '../../components/ThemedSuspense';
import { useState } from 'react';
import {
  IoBagOutline,
  IoArrowForwardOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const { cart, isLoading, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const [isRemoving, setIsRemoving] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null);

  if (isLoading) {
    return (
      <div className='cart-loading'>
        <ThemedSuspense />
      </div>
    );
  }

  const cartItemsCount = cart?.items?.length || 0;
  const cartTotal =
    cart?.items?.reduce((total, item) => {
      return (
        total +
        (item.product?.discountPrice || item.product?.regularPrice) *
          item.quantity
      );
    }, 0) || 0;

  const handleRemoveFromCart = async productId => {
    if (isRemoving) return;
    setIsRemoving(productId);
    try {
      await removeFromCart(productId);
    } finally {
      setIsRemoving(null);
    }
  };

  const handleQuantityChange = async (productId, newQuantity, color, size) => {
    if (isUpdating === productId) return;
    setIsUpdating(productId);
    try {
      await updateQuantity({
        productId,
        quantity: parseInt(newQuantity),
        color,
        size,
      });
    } finally {
      setIsUpdating(null);
    }
  };

  if (!cart?.items?.length) {
    return (
      <div className='empty-cart-container'>
        <div className='empty-cart'>
          <div className='empty-cart-icon'>
            <IoBagOutline />
          </div>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to='/'>
            <Button
              variant='contained'
              color='primary'
              className='continue-shopping-btn'
              endIcon={<IoArrowForwardOutline />}
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className='cart-section'>
      <Container>
        <div className='cart-header'>
          <h1>Your Cart</h1>
          <p>
            You have <span>{cartItemsCount}</span>{' '}
            {cartItemsCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className='cart-content'>
          <div className='cart-items'>
            {/* Desktop View */}
            <div className='cart-table-container desktop-cart'>
              <table className='cart-table'>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart?.items?.map(item => (
                    <tr key={`${item.product._id}-${item.color}-${item.size}`}>
                      <td>
                        <Link
                          to={`/product/${item?.product?._id}`}
                          className='cart-product'
                        >
                          <div className='cart-product-image'>
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.title}
                              loading='lazy'
                            />
                          </div>
                          <div className='cart-product-info'>
                            <h3>
                              {item.product.title.substring(0, 40)}
                              {item.product.title.length > 40 ? '...' : ''}
                            </h3>
                            <Rating
                              value={item.product.rating || 0}
                              readOnly
                              size='small'
                            />
                            <div className='cart-product-meta'>
                              {item.color && (
                                <span className='product-color'>
                                  Color: {item.color}
                                </span>
                              )}
                              {item.size && (
                                <span className='product-size'>
                                  Size: {item.size}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className='cart-price'>
                        TK{' '}
                        {item.product.discountPrice ||
                          item.product.regularPrice}
                      </td>
                      <td>
                        <QuantityBox
                          defaultValue={item.quantity}
                          onChange={value =>
                            handleQuantityChange(
                              item.product._id,
                              value,
                              item.color,
                              item.size
                            )
                          }
                        />
                      </td>
                      <td className='cart-subtotal'>
                        TK{' '}
                        {(item.product.discountPrice ||
                          item.product.regularPrice) * item.quantity}
                      </td>
                      <td>
                        <IconButton
                          className='remove-item'
                          onClick={() => handleRemoveFromCart(item.product._id)}
                          disabled={isRemoving === item.product._id}
                        >
                          <CloseIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className='mobile-cart'>
              {cart?.items?.map(item => (
                <div
                  className='cart-item-card'
                  key={`${item.product._id}-${item.color}-${item.size}-mobile`}
                >
                  <div className='cart-item-header'>
                    <Link
                      to={`/product/${item?.product?._id}`}
                      className='cart-item-image'
                    >
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.title}
                        loading='lazy'
                      />
                    </Link>
                    <div className='cart-item-details'>
                      <Link to={`/product/${item?.product?._id}`}>
                        <h3>
                          {item.product.title.substring(0, 30)}
                          {item.product.title.length > 30 ? '...' : ''}
                        </h3>
                      </Link>
                      <div className='cart-item-meta'>
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>
                      <div className='cart-item-price'>
                        TK{' '}
                        {item.product.discountPrice ||
                          item.product.regularPrice}
                      </div>
                    </div>
                    <IconButton
                      className='remove-item-mobile'
                      onClick={() => handleRemoveFromCart(item.product._id)}
                      disabled={isRemoving === item.product._id}
                    >
                      <IoTrashOutline />
                    </IconButton>
                  </div>
                  <div className='cart-item-footer'>
                    <div className='cart-item-quantity'>
                      <span>Quantity:</span>
                      <QuantityBox
                        defaultValue={item.quantity}
                        onChange={value =>
                          handleQuantityChange(
                            item.product._id,
                            value,
                            item.color,
                            item.size
                          )
                        }
                      />
                    </div>
                    <div className='cart-item-subtotal'>
                      <span>Subtotal:</span>
                      <strong>
                        TK{' '}
                        {(item.product.discountPrice ||
                          item.product.regularPrice) * item.quantity}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='cart-summary'>
            <div className='summary-card'>
              <h2>Order Summary</h2>
              <div className='summary-row'>
                <span>Subtotal</span>
                <span>TK {cartTotal}</span>
              </div>
              <div className='summary-row'>
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <Divider className='summary-divider' />
              <div className='summary-row total'>
                <span>Total</span>
                <span>TK {cartTotal}</span>
              </div>

              {isAuthenticated ? (
                <Link to='/checkout' className='checkout-link'>
                  <Button
                    variant='contained'
                    color='primary'
                    className='checkout-btn'
                    endIcon={<IoArrowForwardOutline />}
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
              ) : (
                <Link to='/login' className='checkout-link'>
                  <Button
                    variant='contained'
                    color='primary'
                    className='checkout-btn'
                  >
                    Login to Checkout
                  </Button>
                </Link>
              )}

              <Link to='/' className='continue-shopping'>
                <Button variant='outlined' className='continue-btn'>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Cart;
