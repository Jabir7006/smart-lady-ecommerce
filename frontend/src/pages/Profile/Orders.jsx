import { useOrder } from '../../hooks/useOrder';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Stack,
  Button,
  Card,
  CardMedia,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LocalShipping,
  AccessTime,
  CheckCircle,
  Cancel,
  ShoppingBag,
  ContentCopy,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

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

const Orders = () => {
  const { orders, isLoadingOrders, ordersError, cancelOrder } = useOrder();

  const handleCopyOrderId = (orderId, event) => {
    event.preventDefault(); // Prevent navigation when clicking the copy button
    navigator.clipboard.writeText(orderId);
    toast.success('Order ID copied to clipboard');
  };

  if (isLoadingOrders) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight={400}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (ordersError) {
    return (
      <Alert severity='error' sx={{ my: 2 }}>
        Error loading orders. Please try again later.
      </Alert>
    );
  }

  if (!orders?.length) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 2,
          bgcolor: 'grey.50',
          border: '2px dashed',
          borderColor: 'grey.300',
        }}
      >
        <ShoppingBag sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant='h6' gutterBottom>
          No Orders Yet
        </Typography>
        <Typography color='text.secondary' paragraph>
          You haven't placed any orders yet. Start shopping to see your orders
          here.
        </Typography>
        <Link to='/shop'>
          <Button variant='contained' color='primary'>
            Start Shopping
          </Button>
        </Link>
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      {orders.map(order => (
        <Paper
          key={order._id}
          sx={{
            p: 3,
            borderRadius: 2,
            '&:hover': {
              boxShadow: 3,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant='subtitle2' color='text.secondary'>
                  Order #{order._id.slice(-8).toUpperCase()}
                </Typography>
                <Tooltip title='Copy Order ID for tracking'>
                  <IconButton
                    size='small'
                    onClick={e => handleCopyOrderId(order._id, e)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <ContentCopy fontSize='small' />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ display: 'block', mt: 0.5 }}
              >
                Full Order ID: {order._id}
              </Typography>
            </Box>
            <Chip
              icon={getStatusIcon(order.status)}
              label={order.status}
              color={getStatusColor(order.status)}
              size='small'
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
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
              <Paper variant='outlined' sx={{ p: 2 }}>
                <Typography variant='h6' gutterBottom>
                  Order Summary
                </Typography>
                <Stack spacing={2}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant='body2' color='text.secondary'>
                      Subtotal
                    </Typography>
                    <Typography variant='subtitle2'>
                      ৳{(order.totalPrice - order.shippingPrice).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant='body2' color='text.secondary'>
                      Shipping
                    </Typography>
                    <Typography variant='subtitle2'>
                      ৳{order.shippingPrice.toFixed(2)}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant='subtitle1'>Total</Typography>
                    <Typography variant='h6' color='primary.main'>
                      ৳{order.totalPrice.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ mt: 2 }}>
                  <Typography variant='subtitle2' gutterBottom>
                    Shipping Address
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
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

                {order.status === 'Pending' && (
                  <Button
                    variant='outlined'
                    color='error'
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to cancel this order?'
                        )
                      ) {
                        cancelOrder(order._id);
                      }
                    }}
                  >
                    Cancel Order
                  </Button>
                )}
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='caption' color='text.secondary'>
              Ordered on{' '}
              {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
            </Typography>
            <Link to={`/profile/orders/${order._id}`}>
              <Button variant='text' size='small'>
                View Details
              </Button>
            </Link>
          </Box>
        </Paper>
      ))}
    </Stack>
  );
};

export default Orders;
