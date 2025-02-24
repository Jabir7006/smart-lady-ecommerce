import AddressList from '../../components/AddressList';
import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { useOrder } from '../../hooks/useOrder';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Alert,
  AlertTitle,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  useTheme,
  useMediaQuery,
  Collapse,
  Fade,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  LocalShipping,
  Security,
  Payment as PaymentIcon,
  ShoppingBag,
  AccessTime,
  NavigateNext,
  NavigateBefore,
  CheckCircle,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { cart, isLoading: isLoadingCart } = useCart();
  const { createOrder, isCreatingOrder } = useOrder();
  const [selectedDeliveryOption, setSelectedDeliveryOption] =
    useState('standard');
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const handleNext = () => {
    if (activeStep === 0 && !selectedAddress) {
      setError('Please select a delivery address');
      return;
    }
    setError(null);
    setActiveStep(prevStep => prevStep + 1);
    setCompleted({ ...completed, [activeStep]: true });
  };

  const handleBack = () => {
    setError(null);
    setActiveStep(prevStep => prevStep - 1);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    if (!cart?.items?.length) {
      setError('Your cart is empty');
      return;
    }

    setOpenConfirmModal(true);
  };

  const handleConfirmOrder = async () => {
    try {
      setOpenConfirmModal(false);
      await createOrder({
        shippingAddress: selectedAddress._id,
        cartId: cart._id,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    }
  };

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: '3-5 business days',
      price: 100.0,
      icon: LocalShipping,
    },
  ];

  // Calculate order summary from cart data
  const orderSummary = {
    subtotal:
      cart?.items?.reduce((total, item) => {
        return (
          total +
          (item.product?.discountPrice || item.product?.regularPrice) *
            item.quantity
        );
      }, 0) || 0,
    shipping: 100.0,
    get total() {
      return this.subtotal + this.shipping;
    },
    items: cart?.items || [],
  };

  const steps = [
    {
      label: 'Shipping Address',
      description: 'Select or add a delivery address',
      content: (
        <AddressList
          onAddressSelect={setSelectedAddress}
          selectedAddress={selectedAddress}
        />
      ),
    },
    {
      label: 'Delivery Method',
      description: 'Shipping information',
      content: (
        <Stack spacing={2}>
          <Paper
            variant='outlined'
            sx={{
              p: 2,
              borderColor: 'primary.main',
              bgcolor: 'primary.50',
              transition: 'all 0.3s ease',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <LocalShipping sx={{ mr: 2, mt: 0.5, color: 'text.secondary' }} />
              <Box>
                <Typography variant='subtitle1'>Standard Delivery</Typography>
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  3-5 business days
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Flat rate shipping across Bangladesh
                </Typography>
                <Typography
                  variant='subtitle1'
                  sx={{
                    mt: 1,
                    color: 'primary.main',
                    fontWeight: 'medium',
                  }}
                >
                  ৳100.00
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Stack>
      ),
    },
    {
      label: 'Payment',
      description: 'Select your payment method',
      content: (
        <Stack spacing={2}>
          <Paper
            variant='outlined'
            sx={{
              p: 2,
              borderColor: 'primary.main',
              bgcolor: 'primary.50',
              transition: 'all 0.3s ease',
            }}
          >
            <FormControlLabel
              value='cod'
              control={<Radio checked />}
              label={
                <Box sx={{ ml: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PaymentIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant='subtitle1'>
                      Cash on Delivery
                    </Typography>
                  </Box>
                  <Typography variant='body2' color='text.secondary'>
                    Pay with cash when your order is delivered
                  </Typography>
                </Box>
              }
            />
          </Paper>
          <Paper
            variant='outlined'
            sx={{
              p: 2,
              borderColor: 'divider',
              opacity: 0.5,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Typography variant='body2' color='text.secondary'>
                More payment options coming soon
              </Typography>
            </Box>
            <FormControlLabel
              disabled
              value='card'
              control={<Radio />}
              label={
                <Box sx={{ ml: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PaymentIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant='subtitle1'>Card Payment</Typography>
                  </Box>
                </Box>
              }
            />
          </Paper>
        </Stack>
      ),
    },
  ];

  if (isLoadingCart || isCreatingOrder) {
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

  if (!cart?.items?.length) {
    return (
      <Container maxWidth='xl' sx={{ py: 4 }}>
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
            Your Cart is Empty
          </Typography>
          <Typography color='text.secondary' paragraph>
            Add items to your cart to proceed with checkout.
          </Typography>
          <Link to='/shop'>
            <Button variant='contained' color='primary'>
              Continue Shopping
            </Button>
          </Link>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth='xl'>
        {error && (
          <Alert severity='error' sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Typography
          variant='h4'
          component='h1'
          gutterBottom
          sx={{ mb: 4, fontWeight: 'bold' }}
        >
          Checkout
        </Typography>

        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={3}>
              {/* Security Alert */}
              <Fade in timeout={500}>
                <Alert
                  icon={<Security fontSize='inherit' />}
                  severity='success'
                  sx={{
                    '& .MuiAlert-message': { width: '100%' },
                    boxShadow: 1,
                    borderRadius: 2,
                  }}
                >
                  <AlertTitle>Secure Checkout</AlertTitle>
                  Your data is protected with SSL encryption
                </Alert>
              </Fade>

              {/* Checkout Steps */}
              <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Stepper
                  activeStep={activeStep}
                  orientation={isMobile ? 'vertical' : 'horizontal'}
                  sx={{ p: 3 }}
                >
                  {steps.map((step, index) => (
                    <Step key={step.label} completed={completed[index]}>
                      <StepLabel
                        StepIconProps={{
                          sx: {
                            '& .MuiStepIcon-root': {
                              fontSize: 28,
                            },
                          },
                        }}
                      >
                        <Typography variant='subtitle1' fontWeight='medium'>
                          {step.label}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {step.description}
                        </Typography>
                      </StepLabel>
                      {isMobile && (
                        <StepContent>
                          <Box sx={{ py: 2 }}>{step.content}</Box>
                          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                            <Button
                              disabled={activeStep === 0}
                              onClick={handleBack}
                              startIcon={<NavigateBefore />}
                              variant='outlined'
                              sx={{
                                '&.Mui-disabled': {
                                  pointerEvents: 'none',
                                  opacity: 0.5,
                                },
                              }}
                            >
                              Back
                            </Button>
                            <Button
                              variant='contained'
                              onClick={
                                activeStep === steps.length - 1
                                  ? handlePlaceOrder
                                  : handleNext
                              }
                              endIcon={
                                index === steps.length - 1 ? (
                                  <ShoppingBag />
                                ) : (
                                  <NavigateNext />
                                )
                              }
                              disabled={
                                (activeStep === 0 && !selectedAddress) ||
                                isCreatingOrder ||
                                !cart?.items?.length
                              }
                            >
                              {index === steps.length - 1
                                ? 'Place Order'
                                : 'Continue'}
                            </Button>
                          </Box>
                        </StepContent>
                      )}
                    </Step>
                  ))}
                </Stepper>

                {!isMobile && (
                  <Collapse in timeout={500}>
                    <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
                      {steps[activeStep].content}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: 2,
                          mt: 3,
                        }}
                      >
                        <Button
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          startIcon={<NavigateBefore />}
                          variant='outlined'
                          sx={{
                            '&.Mui-disabled': {
                              pointerEvents: 'none',
                              opacity: 0.5,
                            },
                          }}
                        >
                          Back
                        </Button>
                        <Button
                          variant='contained'
                          onClick={
                            activeStep === steps.length - 1
                              ? handlePlaceOrder
                              : handleNext
                          }
                          endIcon={
                            activeStep === steps.length - 1 ? (
                              <ShoppingBag />
                            ) : (
                              <NavigateNext />
                            )
                          }
                          disabled={
                            (activeStep === 0 && !selectedAddress) ||
                            isCreatingOrder ||
                            !cart?.items?.length
                          }
                        >
                          {activeStep === steps.length - 1
                            ? 'Place Order'
                            : 'Continue'}
                        </Button>
                      </Box>
                    </Box>
                  </Collapse>
                )}
              </Paper>
            </Stack>
          </Grid>

          {/* Right Column - Order Summary */}
          <Grid item xs={12} lg={4}>
            <Fade in timeout={500}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  position: 'sticky',
                  top: 24,
                  bgcolor: 'background.paper',
                }}
              >
                <Typography
                  variant='h6'
                  gutterBottom
                  sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <ShoppingBag fontSize='small' />
                  Order Summary
                </Typography>

                {/* Order Items */}
                <Stack spacing={2} sx={{ mb: 3 }}>
                  {orderSummary.items.map((item, index) => (
                    <Card
                      key={index}
                      variant='outlined'
                      sx={{
                        display: 'flex',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 1,
                        },
                      }}
                    >
                      <CardMedia
                        component='img'
                        sx={{
                          width: 88,
                          height: 88,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                        image={item.product.images[0].url}
                        alt={item.product.title}
                      />
                      <CardContent
                        sx={{ flex: 1, py: 1, '&:last-child': { pb: 1 } }}
                      >
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
                          <Typography variant='body2' color='text.secondary'>
                            Qty: {item.quantity}
                          </Typography>
                          <Typography variant='subtitle2' color='primary.main'>
                            ৳
                            {(
                              (item.product.discountPrice ||
                                item.product.regularPrice) * item.quantity
                            ).toFixed(2)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Price Breakdown */}
                <Stack spacing={2}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant='body2' color='text.secondary'>
                      Subtotal
                    </Typography>
                    <Typography variant='subtitle2'>
                      ৳{orderSummary.subtotal.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant='body2' color='text.secondary'>
                      Shipping
                    </Typography>
                    <Typography
                      variant='subtitle2'
                      color={
                        selectedDeliveryOption === 'express'
                          ? 'primary.main'
                          : 'inherit'
                      }
                    >
                      ৳{orderSummary.shipping.toFixed(2)}
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
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography
                        variant='h5'
                        color='primary.main'
                        fontWeight='bold'
                      >
                        ৳{orderSummary.total.toFixed(2)}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        Including shipping
                      </Typography>
                    </Box>
                  </Box>
                </Stack>

                {!isMobile && activeStep === steps.length - 1 && (
                  <Button
                    variant='contained'
                    size='large'
                    fullWidth
                    startIcon={<ShoppingBag />}
                    sx={{
                      mt: 3,
                      py: 1.5,
                      bgcolor: 'success.main',
                      '&:hover': {
                        bgcolor: 'success.dark',
                      },
                    }}
                    disabled={isCreatingOrder || !selectedAddress}
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </Button>
                )}

                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{ display: 'block', mt: 2, textAlign: 'center' }}
                >
                  Your personal data will be used to process your order, support
                  your experience throughout this website, and for other
                  purposes described in our privacy policy.
                </Typography>
              </Paper>
            </Fade>
          </Grid>
        </Grid>

        {/* Add Confirmation Modal */}
        <Dialog
          open={openConfirmModal}
          onClose={() => setOpenConfirmModal(false)}
          maxWidth='sm'
          fullWidth
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShoppingBag color='primary' />
              <Typography variant='h6'>Confirm Order</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant='subtitle1' gutterBottom>
                Delivery Address:
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {selectedAddress?.street}, {selectedAddress?.area}
                <br />
                {selectedAddress?.city}, {selectedAddress?.division}{' '}
                {selectedAddress?.postCode}
                <br />
                Phone: {selectedAddress?.phone}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant='subtitle1' gutterBottom>
                Order Summary:
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2' color='text.secondary'>
                    Subtotal ({orderSummary.items.length} items)
                  </Typography>
                  <Typography variant='body2'>
                    ৳{orderSummary.subtotal.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='body2' color='text.secondary'>
                    Shipping Fee
                  </Typography>
                  <Typography variant='body2'>
                    ৳{orderSummary.shipping.toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 1,
                  }}
                >
                  <Typography variant='subtitle1'>Total</Typography>
                  <Typography variant='subtitle1' color='primary.main'>
                    ৳{orderSummary.total.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
            <Alert severity='info' sx={{ mt: 2 }}>
              <AlertTitle>Payment Method</AlertTitle>
              Cash on Delivery - Pay when you receive your order
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 0 }}>
            <Button
              onClick={() => setOpenConfirmModal(false)}
              variant='outlined'
              disabled={isCreatingOrder}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmOrder}
              variant='contained'
              color='primary'
              startIcon={
                isCreatingOrder ? (
                  <CircularProgress size={20} />
                ) : (
                  <CheckCircle />
                )
              }
              disabled={isCreatingOrder}
            >
              {isCreatingOrder ? 'Placing Order...' : 'Confirm Order'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Checkout;
