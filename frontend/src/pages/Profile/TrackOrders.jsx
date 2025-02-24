import { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useOrder, useOrderDetails } from '../../hooks/useOrder';
import { useForm } from 'react-hook-form';
import { format, parseISO } from 'date-fns';
import {
  LocalShipping,
  AccessTime,
  CheckCircle,
  Cancel,
  ShoppingBag,
  Payment,
} from '@mui/icons-material';

const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const getStatusIcon = status => {
  switch (status) {
    case 'Pending':
      return <AccessTime />;
    case 'Processing':
      return <LocalShipping />;
    case 'Shipped':
      return <LocalShipping />;
    case 'Delivered':
      return <CheckCircle />;
    case 'Cancelled':
      return <Cancel />;
    default:
      return <ShoppingBag />;
  }
};

const getStatusColor = status => {
  switch (status) {
    case 'Pending':
      return 'warning';
    case 'Processing':
      return 'info';
    case 'Shipped':
      return 'primary';
    case 'Delivered':
      return 'success';
    case 'Cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const TrackOrders = () => {
  const [orderId, setOrderId] = useState('');
  const { order, isLoading, error } = useOrderDetails(orderId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  const onSubmit = data => {
    // Clear any previous errors
    clearErrors();

    // Check if the order ID is in valid MongoDB ObjectId format (24 characters hex string)
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!objectIdPattern.test(data.orderId)) {
      setError('orderId', {
        type: 'manual',
        message: 'Please enter a valid order ID (24 characters)',
      });
      return;
    }

    setOrderId(data.orderId);
  };

  const getStepPosition = status => {
    if (status === 'Cancelled') return -1;
    return orderStatuses.indexOf(status);
  };

  const formatDate = dateString => {
    try {
      return format(parseISO(dateString), 'PPP');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Typography variant='h4' gutterBottom>
        Track Your Order
      </Typography>

      {/* Order Tracking Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              label='Order ID'
              {...register('orderId', {
                required: 'Order ID is required',
                pattern: {
                  value: /^[0-9a-fA-F]{24}$/,
                  message: 'Please enter a valid order ID (24 characters)',
                },
              })}
              error={!!errors.orderId}
              helperText={
                errors.orderId?.message ||
                'Enter the 24-character order ID from your order confirmation'
              }
              fullWidth
              placeholder='e.g., 507f1f77bcf86cd799439011'
            />
            <Box>
              <LoadingButton
                type='submit'
                variant='contained'
                loading={isLoading}
              >
                Track Order
              </LoadingButton>
            </Box>
          </Stack>
        </form>
      </Paper>

      {/* Loading State */}
      {isLoading && (
        <Box display='flex' justifyContent='center' my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State with improved messaging */}
      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error.response?.data?.message === 'Cast to ObjectId failed'
            ? 'Invalid order ID format. Please check your order ID and try again.'
            : error.response?.data?.message ||
              'Failed to find order. Please check the Order ID.'}
        </Alert>
      )}

      {/* Tracking Result */}
      {order && (
        <Paper sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant='h6'>
              Order #{order._id.slice(-8).toUpperCase()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getStatusIcon(order.status)}
              <Typography
                variant='subtitle1'
                color={`${getStatusColor(order.status)}.main`}
              >
                {order.status}
              </Typography>
            </Box>
          </Box>

          {/* Order Timeline */}
          {order.status !== 'Cancelled' && (
            <Box sx={{ mb: 4 }}>
              <Stepper
                activeStep={getStepPosition(order.status)}
                alternativeLabel
              >
                {orderStatuses.map(label => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Order Details */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant='h6' gutterBottom>
                Order Items
              </Typography>
              <Stack spacing={2}>
                {order.orderItems.map((item, index) => (
                  <Card
                    key={index}
                    variant='outlined'
                    sx={{
                      display: 'flex',
                      '&:hover': {
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <CardMedia
                      component='img'
                      sx={{ width: 100, height: 100, objectFit: 'cover' }}
                      image={item.product.images[0].url}
                      alt={item.product.title}
                    />
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant='subtitle2' gutterBottom>
                        {item.product.title}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {item.color} / {item.size}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mt: 1,
                        }}
                      >
                        <Typography variant='body2'>
                          Qty: {item.quantity}
                        </Typography>
                        <Typography variant='subtitle2' color='primary.main'>
                          ৳{item.price.toFixed(2)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                {/* Shipping Address */}
                <Box>
                  <Typography variant='subtitle1' gutterBottom>
                    Shipping Address
                  </Typography>
                  <Typography variant='body2'>
                    {order.shippingAddress?.fullName}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {order.shippingAddress?.street}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {order.shippingAddress?.area}, {order.shippingAddress?.city}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {order.shippingAddress?.division} -{' '}
                    {order.shippingAddress?.postCode}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Phone: {order.shippingAddress?.phone}
                  </Typography>
                </Box>

                {/* Payment Info */}
                <Box>
                  <Typography variant='subtitle1' gutterBottom>
                    Order Summary
                  </Typography>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant='body2' color='text.secondary'>
                        Payment Method
                      </Typography>
                      <Typography variant='body2'>
                        {order.paymentMethod}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant='body2' color='text.secondary'>
                        Payment Status
                      </Typography>
                      <Typography
                        variant='body2'
                        color={
                          order.paymentStatus === 'Paid'
                            ? 'success.main'
                            : 'warning.main'
                        }
                      >
                        {order.paymentStatus}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant='body2' color='text.secondary'>
                        Subtotal
                      </Typography>
                      <Typography variant='body2'>
                        ৳{(order.totalPrice - order.shippingPrice).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant='body2' color='text.secondary'>
                        Shipping
                      </Typography>
                      <Typography variant='body2'>
                        ৳{order.shippingPrice.toFixed(2)}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant='subtitle1'>Total</Typography>
                      <Typography
                        variant='h6'
                        color='primary.main'
                        sx={{ fontWeight: 600 }}
                      >
                        ৳{order.totalPrice.toFixed(2)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant='caption' color='text.secondary'>
              Order placed on {formatDate(order.createdAt)}
              {order.deliveredAt && (
                <> • Delivered on {formatDate(order.deliveredAt)}</>
              )}
              {order.cancelledAt && (
                <> • Cancelled on {formatDate(order.cancelledAt)}</>
              )}
            </Typography>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default TrackOrders;
