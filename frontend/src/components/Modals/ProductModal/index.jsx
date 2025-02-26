import {
  Button,
  Dialog,
  Rating,
  IconButton,
  Typography,
  Box,
  Divider,
  Chip,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import 'swiper/css';
import 'swiper/css/navigation';
import { MdClose, MdOutlineCompareArrows } from 'react-icons/md';
import { IoIosHeart } from 'react-icons/io';
import { FaShoppingCart } from 'react-icons/fa';
import { TbTruckDelivery } from 'react-icons/tb';
import { BiStore } from 'react-icons/bi';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import QuantityBox from '../../Home/QuantityBox';
import ProductZoom from './ProductZoom';
import { useContext, useState } from 'react';
import GlobalContext from '../../../context/GlobalContext';
import ProductSizeSelector from '../../ui/ProductSizeSelector';
import { useProduct } from '../../../hooks/useProducts';
import ThemedSuspense from '../../ThemedSuspense';
import generateShortDescription from '../../../utils/generateShortDescription';
import { useCart } from '../../../hooks/useCart';
import { toast } from 'react-hot-toast';
import ProductColorSelector from '../../ui/ProductColorSelector';

const ProductModal = () => {
  const { setisOpenProductModal, productId } = useContext(GlobalContext);
  const { data, isLoading } = useProduct(productId);
  const { addToCart } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const product = data?.data;

  if (isLoading) {
    return <ThemedSuspense />;
  }

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error('Please select both color and size.');
      return;
    }

    addToCart({
      productId: product._id,
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
    });
  };

  const getStockStatus = () => {
    if (product?.quantity === 0)
      return { label: 'OUT OF STOCK', color: 'error' };
    if (product?.quantity < 10) return { label: 'LOW STOCK', color: 'warning' };
    return { label: 'IN STOCK', color: 'success' };
  };

  return (
    <Dialog
      open={true}
      maxWidth='lg'
      className='productModal'
      onClose={() => setisOpenProductModal(false)}
    >
      <Box sx={{ position: 'relative', p: { xs: 2, sm: 3 } }}>
        <IconButton
          className='close_'
          onClick={() => setisOpenProductModal(false)}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <MdClose />
        </IconButton>

        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          component='h1'
          sx={{ pr: 4, mb: 1 }}
        >
          {product?.title}
        </Typography>

        <Stack direction='row' spacing={2} alignItems='center' mb={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant='body2' color='text.secondary'>
              Brand:
            </Typography>
            <Typography variant='body2' fontWeight='bold'>
              {product?.brand?.title}
            </Typography>
          </Box>
          <Rating
            name='read-only'
            value={product?.totalrating || 0}
            size='small'
            precision={0.5}
            readOnly
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Box className='row mt-2 productDetailsModal'>
          <Box
            className={isMobile ? 'col-12' : 'col-md-5'}
            mb={isMobile ? 3 : 0}
          >
            <ProductZoom
              images={product?.images}
              discountPercentage={product?.discountPercentage}
            />
          </Box>

          <Box className={isMobile ? 'col-12' : 'col-md-7'}>
            <Stack spacing={3}>
              <Box>
                <Stack direction='row' alignItems='center' spacing={2} mb={1}>
                  <Typography
                    variant='h6'
                    color='text.secondary'
                    sx={{ textDecoration: 'line-through' }}
                  >
                    TK {product?.regularPrice}
                  </Typography>
                  <Typography variant='h5' color='error.main' fontWeight='bold'>
                    TK {product?.discountPrice}
                  </Typography>
                </Stack>

                <Chip
                  label={getStockStatus().label}
                  color={getStockStatus().color}
                  size='small'
                />
              </Box>

              <Box>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  dangerouslySetInnerHTML={{
                    __html: generateShortDescription(product?.description),
                  }}
                />
              </Box>

              <Stack spacing={2}>
                <ProductColorSelector
                  colors={product?.colors}
                  onSelect={setSelectedColor}
                />
                <ProductSizeSelector
                  sizes={product?.sizes}
                  onSelect={size => setSelectedSize(size)}
                />
              </Stack>

              <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                <Box sx={{ width: isMobile ? '100%' : 150 }}>
                  <QuantityBox
                    defaultValue={1}
                    onChange={value => setQuantity(value)}
                  />
                </Box>

                <Button
                  variant='contained'
                  className='btn-blue btn-lg btn-round'
                  onClick={handleAddToCart}
                  fullWidth={isMobile}
                  startIcon={<FaShoppingCart />}
                >
                  Add to Cart
                </Button>
              </Stack>

              <Stack direction='row' spacing={2} mt={2}>
                <Button
                  variant='outlined'
                  className='btn-round btn-sml'
                  fullWidth
                  startIcon={<IoIosHeart />}
                >
                  Wishlist
                </Button>
                <Button
                  variant='outlined'
                  className='btn-round btn-sml'
                  fullWidth
                  startIcon={<MdOutlineCompareArrows />}
                >
                  Compare
                </Button>
              </Stack>

              <Divider />

              <Stack spacing={2}>
                <Typography variant='subtitle2' fontWeight='bold'>
                  Delivery & Returns
                </Typography>
                <Stack direction='row' spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TbTruckDelivery size={20} />
                    <Typography variant='body2'>Free Delivery</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BiStore size={20} />
                    <Typography variant='body2'>Store Pickup</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ProductModal;
