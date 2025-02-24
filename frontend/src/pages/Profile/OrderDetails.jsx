import { useParams, Link } from 'react-router-dom';
import { useOrderDetails } from '../../hooks/useOrder';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  Stack,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardMedia,
  CardContent,
  Button,
  Breadcrumbs,
  Link as MuiLink,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LocalShipping,
  AccessTime,
  CheckCircle,
  Cancel,
  ShoppingBag,
  LocationOn,
  Phone,
  Person,
  NavigateNext,
  Home,
  Receipt,
  Inventory,
  Payment,
  ContentCopy,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
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

const getOrderSteps = status => {
  const steps = [
    { label: 'Order Placed', icon: <ShoppingBag /> },
    { label: 'Processing', icon: <AccessTime /> },
    { label: 'Shipped', icon: <LocalShipping /> },
    { label: 'Delivered', icon: <CheckCircle /> },
  ];

  let activeStep;
  switch (status) {
    case 'Pending':
      activeStep = 0;
      break;
    case 'Processing':
      activeStep = 1;
      break;
    case 'Shipped':
      activeStep = 2;
      break;
    case 'Delivered':
      activeStep = 3;
      break;
    case 'Cancelled':
      activeStep = -1;
      break;
    default:
      activeStep = 0;
  }

  return { steps, activeStep };
};

const OrderDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { orderId } = useParams();
  const { order, isLoading, error, cancelOrder, isCancelling } =
    useOrderDetails(orderId);
  const { steps, activeStep } = order
    ? getOrderSteps(order.status)
    : { steps: [], activeStep: 0 };

  const formatDate = dateString => {
    try {
      return format(parseISO(dateString), 'PPP p');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order._id);
    toast.success('Order ID copied to clipboard');
  };

  if (isLoading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='60vh'
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth='xl' sx={{ py: 4 }}>
        <Alert severity='error'>
          {error?.message ||
            "Order not found or you don't have permission to view it."}
        </Alert>
      </Container>
    );
  }

  if (order.status === 'Cancelled' && !order.shippingAddress) {
    return (
      <Container maxWidth='xl' sx={{ py: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant='h5'>
              Order #{order._id.slice(-8).toUpperCase()}
            </Typography>
            <Chip
              icon={<Cancel />}
              label='Cancelled'
              color='error'
              size='medium'
            />
          </Box>
          <Alert severity='info'>
            This order was cancelled and some details may not be available.
          </Alert>
          <Box sx={{ mt: 3 }}>
            <Typography variant='caption' color='text.secondary'>
              Order placed on {formatDate(order.createdAt)}
              {order.cancelledAt && (
                <> • Cancelled on {formatDate(order.cancelledAt)}</>
              )}
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await cancelOrder(orderId);
    }
  };

  return (
    <Container maxWidth='xl' sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNext fontSize='small' />} sx={{ mb: 3 }}>
        <MuiLink
          component={Link}
          to='/'
          color='inherit'
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Home sx={{ mr: 0.5 }} fontSize='inherit' />
          Home
        </MuiLink>
        <MuiLink
          component={Link}
          to='/profile/orders'
          color='inherit'
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Receipt sx={{ mr: 0.5 }} fontSize='inherit' />
          My Orders
        </MuiLink>
        <Typography
          color='text.primary'
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Inventory sx={{ mr: 0.5 }} fontSize='inherit' />
          Order Details
        </Typography>
      </Breadcrumbs>

      {/* Order Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          bgcolor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant='h5' sx={{ color: 'inherit' }}>
                Order #{order._id.slice(-8).toUpperCase()}
              </Typography>
              <Tooltip title='Copy full Order ID'>
                <IconButton
                  size='small'
                  onClick={handleCopyOrderId}
                  sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  <ContentCopy fontSize='small' />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography
              variant='caption'
              sx={{ color: 'rgba(255, 255, 255, 0.8)', display: 'block' }}
            >
              Full Order ID: {order._id}
            </Typography>
            <Typography
              variant='body2'
              sx={{ color: 'rgba(255, 255, 255, 0.8)', mt: 1 }}
            >
              Placed on {formatDate(order.createdAt)}
            </Typography>
          </Box>
          <Chip
            icon={getStatusIcon(order.status)}
            label={order.status}
            color={getStatusColor(order.status)}
            sx={{
              bgcolor: 'white',
              '& .MuiChip-icon': {
                color: `${theme.palette[getStatusColor(order.status)].main} !important`,
              },
            }}
          />
        </Box>
      </Paper>

      {/* Order Progress */}
      {order.status !== 'Cancelled' && (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant='h6' gutterBottom sx={{ mb: 3 }}>
            Order Progress
          </Typography>
          <Stepper
            activeStep={activeStep}
            alternativeLabel={!isMobile}
            orientation={isMobile ? 'vertical' : 'horizontal'}
          >
            {steps.map((step, index) => (
              <Step key={step.label} completed={index < activeStep}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor:
                          index <= activeStep ? 'primary.main' : 'grey.300',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        boxShadow: index <= activeStep ? 2 : 0,
                      }}
                    >
                      {step.icon}
                    </Box>
                  )}
                >
                  <Typography
                    variant='body2'
                    color={
                      index <= activeStep ? 'primary.main' : 'text.secondary'
                    }
                    sx={{ fontWeight: index <= activeStep ? 600 : 400 }}
                  >
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      )}

      <Grid container spacing={4}>
        {/* Order Items */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant='h6' gutterBottom sx={{ mb: 3 }}>
              Order Items
            </Typography>
            <Stack spacing={2}>
              {order.orderItems.map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    display: 'flex',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: 1,
                    },
                  }}
                >
                  <CardMedia
                    component='img'
                    sx={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                    image={item.product.images[0].url}
                    alt={item.product.title}
                  />
                  <CardContent sx={{ flex: 1, p: 2 }}>
                    <Typography
                      variant='subtitle1'
                      gutterBottom
                      component={Link}
                      to={`/product/${item.product._id}`}
                      sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      {item.product.title}
                    </Typography>
                    <Stack direction='row' spacing={2} sx={{ mb: 1 }}>
                      <Chip
                        label={item.color}
                        size='small'
                        sx={{ bgcolor: 'grey.100' }}
                      />
                      <Chip
                        label={item.size}
                        size='small'
                        sx={{ bgcolor: 'grey.100' }}
                      />
                    </Stack>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant='body2' color='text.secondary'>
                        Qty: {item.quantity}
                      </Typography>
                      <Typography
                        variant='subtitle2'
                        color='primary.main'
                        sx={{ fontWeight: 600 }}
                      >
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Shipping Address */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography
                variant='subtitle1'
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
              >
                <LocationOn color='primary' />
                Shipping Address
              </Typography>
              <Box sx={{ pl: 4 }}>
                <Typography
                  variant='body1'
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  {order.shippingAddress?.fullName || 'N/A'}
                </Typography>
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  <Phone
                    fontSize='small'
                    sx={{ mr: 1, verticalAlign: 'middle' }}
                  />
                  {order.shippingAddress?.phone || 'N/A'}
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ whiteSpace: 'pre-line' }}
                >
                  {order.shippingAddress?.street || 'N/A'}
                  {'\n'}
                  {order.shippingAddress?.area && order.shippingAddress?.city
                    ? `${order.shippingAddress.area}, ${order.shippingAddress.city}`
                    : 'N/A'}
                  {'\n'}
                  {order.shippingAddress?.division &&
                  order.shippingAddress?.postCode
                    ? `${order.shippingAddress.division} - ${order.shippingAddress.postCode}`
                    : 'N/A'}
                </Typography>
              </Box>
            </Paper>

            {/* Payment Info */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography
                variant='subtitle1'
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
              >
                <Payment color='primary' />
                Payment Information
              </Typography>
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Payment Method
                  </Typography>
                  <Chip
                    label='Cash on Delivery'
                    size='small'
                    icon={<Payment fontSize='small' />}
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Payment Status
                  </Typography>
                  <Chip
                    size='small'
                    label={order.paymentStatus}
                    color={
                      order.paymentStatus === 'Paid' ? 'success' : 'warning'
                    }
                  />
                </Box>
                <Divider />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
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
                    alignItems: 'center',
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
                    alignItems: 'center',
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
            </Paper>

            {order.status === 'Pending' && (
              <Button
                variant='contained'
                color='error'
                fullWidth
                disabled={isCancelling}
                onClick={handleCancelOrder}
                sx={{
                  py: 1.5,
                  bgcolor: 'error.main',
                  '&:hover': {
                    bgcolor: 'error.dark',
                  },
                }}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetails;
