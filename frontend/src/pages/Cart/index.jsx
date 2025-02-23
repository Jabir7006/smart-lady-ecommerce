import { Link } from 'react-router-dom';
import { Box, Button, Container, Rating, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QuantityBox from '../../components/Home/QuantityBox';
import { useCart } from '../../hooks/useCart';
import ThemedSuspense from '../../components/ThemedSuspense';
import { useState } from 'react';
import { IoBagOutline } from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const { cart, isLoading, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const [isRemoving, setIsRemoving] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null);

  if (isLoading) {
    return <ThemedSuspense />;
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
      <Container className='py-5'>
        <Box className='text-center'>
          <IoBagOutline size={60} className='text-muted mb-4' />
          <Typography variant='h5' gutterBottom>
            Your Cart is Empty
          </Typography>
          <Typography variant='body1' color='textSecondary' className='mb-4'>
            items to your cart. Review them anytime and easily proceed to
            checkout when ready.
          </Typography>
          <Link to='/'>
            <Button variant='contained' color='primary'>
              Continue Shopping
            </Button>
          </Link>
        </Box>
      </Container>
    );
  }

  return (
    <section className='section cartPage'>
      <div className='container'>
        <div className='mb-4'>
          <h2 className='hd mb-2'>YOUR CART</h2>
          <p className='mb-0'>
            There are <span className='text-danger'>{cartItemsCount}</span>{' '}
            products in your cart
          </p>
        </div>

        <div className='row'>
          <div className='col-md-9'>
            <div className='table-responsive'>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cart?.items?.map(item => (
                    <tr key={item.product._id}>
                      <td>
                        <Link to={`/product/${item?.product?._id}`}>
                          <div className='d-flex align-items-center cartItemimgWrapper'>
                            <div className='imgWrapper'>
                              <img
                                src={item.product.images[0].url}
                                alt={item.product.title.substring(0, 20)}
                              />
                            </div>
                            <div className='info px-3'>
                              <h6>{item.product.title.substring(0, 40)}...</h6>
                              <Rating
                                value={item.product.rating || 0}
                                readOnly
                                size='small'
                              />
                              <p>Color: {item.color}</p>
                              <p>Size: {item.size}</p>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td>
                        <span className='fw-bold'>
                          TK{' '}
                          {item.product.discountPrice ||
                            item.product.regularPrice}
                        </span>
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
                      <td>
                        <span className='fw-bold'>
                          TK{' '}
                          {(item.product.discountPrice ||
                            item.product.regularPrice) * item.quantity}
                        </span>
                      </td>
                      <td>
                        <span
                          className='remove'
                          onClick={() => handleRemoveFromCart(item.product._id)}
                        >
                          <CloseIcon />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className='col-md-3'>
            <div className='card shadow p-4'>
              <h5 className='mb-3'>CART TOTALS</h5>
              <div className='d-flex justify-content-between mb-2'>
                <span>Subtotal</span>
                <span className='text-danger fw-bold'>TK {cartTotal}</span>
              </div>
              <div className='d-flex justify-content-between mb-4'>
                <span>Total</span>
                <span className='text-danger fw-bold'>TK {cartTotal}</span>
              </div>
              {isAuthenticated ? (
                <Link to='/checkout'>
                  <Button variant='contained' color='primary' className='w-100'>
                    Proceed to Checkout
                  </Button>
                </Link>
              ) : (
                <Link to='/login'>
                  <Button variant='contained' color='primary' className='w-100'>
                    Login to Checkout
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
