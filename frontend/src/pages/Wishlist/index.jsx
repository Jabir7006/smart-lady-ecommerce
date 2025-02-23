import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Rating,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';
import { IoMdHeartEmpty } from 'react-icons/io';
import { IoBagOutline } from 'react-icons/io5';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ThemedSuspense from '../../components/ThemedSuspense';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  if (isLoading) {
    return <ThemedSuspense />;
  }

  const handleRemoveFromWishlist = async productId => {
    if (isRemoving) return;
    setIsRemoving(true);
    try {
      await removeFromWishlist(productId);
      // Remove from selected items if it was selected
      setSelectedItems(prev => prev.filter(id => id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAddToCart = product => {
    setSelectedProduct(product);
    setSelectedColor(product.colors[0]?.title || '');
    setSelectedSize(product.sizes[0]?.title || '');
    setOpenDialog(true);
  };

  const handleConfirmAddToCart = () => {
    addToCart({
      productId: selectedProduct._id,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
    });
    setOpenDialog(false);
    setSelectedProduct(null);
    setSelectedColor('');
    setSelectedSize('');
  };

  const handleSelectAll = event => {
    if (event.target.checked) {
      setSelectedItems(wishlist.products.map(product => product._id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = productId => {
    setSelectedItems(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleAddSelectedToCart = async () => {
    try {
      for (const productId of selectedItems) {
        const product = wishlist.products.find(p => p._id === productId);
        if (product && product.quantity > 0) {
          // Get first available color and size
          const defaultColor = product.colors?.[0]?.title || '';
          const defaultSize = product.sizes?.[0]?.title || '';

          if (!defaultColor || !defaultSize) {
            console.error(
              `Missing color or size for product: ${product.title}`
            );
            continue;
          }

          await addToCart({
            productId: product._id,
            quantity: 1,
            color: defaultColor,
            size: defaultSize,
          });
        }
      }
      // Clear selection after adding to cart
      setSelectedItems([]);
    } catch (error) {
      console.error('Error adding selected items to cart:', error);
    }
  };

  const handleRemoveSelected = async () => {
    setIsRemoving(true);
    try {
      // Process removals sequentially to avoid race conditions
      for (const productId of selectedItems) {
        await removeFromWishlist(productId);
        // Remove from selected items as each item is processed
        setSelectedItems(prev => prev.filter(id => id !== productId));
      }
    } catch (error) {
      console.error('Error removing selected items:', error);
      toast.error('Failed to remove some items');
    } finally {
      setIsRemoving(false);
    }
  };

  const renderProducts = () => {
    if (!wishlist?.products) return null;

    return wishlist.products.map(product => (
      <TableRow key={product._id} hover>
        <TableCell padding='checkbox'>
          <Checkbox
            checked={selectedItems.includes(product._id)}
            onChange={() => handleSelectItem(product._id)}
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={product.images[0]?.url}
              alt={product.title}
              className='img-fluid'
              style={{ width: 80, height: 80, objectFit: 'contain' }}
            />
            <Box>
              <Link
                to={`/product/${product._id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Typography variant='subtitle1' sx={{ mb: 1 }}>
                  {product.name}
                </Typography>
              </Link>
              <Rating value={product.rating || 0} readOnly size='small' />
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ ml: 1 }}
              >
                ({product.numReviews || 0})
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Box>
            <Typography variant='h6' color='primary'>
              {product.discountPrice || product.regularPrice} TK
            </Typography>
            {product.discountPrice && (
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ textDecoration: 'line-through' }}
              >
                {product.regularPrice} TK
              </Typography>
            )}
          </Box>
        </TableCell>
        <TableCell>
          <Typography
            variant='body2'
            color={product.quantity > 0 ? 'success.main' : 'error.main'}
            sx={{ fontWeight: 500 }}
          >
            {product.quantity > 0 ? (
              <span style={{ color: 'green' }}>In Stock</span>
            ) : (
              <span style={{ color: 'red' }}>Out of Stock</span>
            )}
          </Typography>
        </TableCell>
        <TableCell>
          <Button
            variant='contained'
            size='small'
            startIcon={<IoBagOutline />}
            onClick={() => handleAddToCart(product)}
            disabled={product.quantity === 0}
            sx={{ mr: 1 }}
          >
            Add to Cart
          </Button>
          <IconButton
            size='small'
            color='error'
            onClick={() => handleRemoveFromWishlist(product._id)}
            disabled={isRemoving}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  if (!wishlist?.products?.length) {
    return (
      <Container maxWidth='lg' sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <IoMdHeartEmpty size={80} color='#ff4081' />
          <Typography variant='h4' sx={{ mt: 3, mb: 2, fontWeight: 500 }}>
            Your Wishlist is Empty
          </Typography>
          <Typography color='text.secondary' sx={{ mb: 4 }}>
            Add items that you like to your wishlist. Review them anytime and
            easily move them to the cart.
          </Typography>
          <Link to='/' style={{ textDecoration: 'none' }}>
            <Button variant='contained' size='large'>
              Continue Shopping
            </Button>
          </Link>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' sx={{ mb: 1, fontWeight: 500 }}>
          My Wishlist ({wishlist.products.length})
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Button
          variant='contained'
          startIcon={<IoBagOutline />}
          onClick={handleAddSelectedToCart}
          disabled={!selectedItems.length}
          sx={{ mr: 2 }}
        >
          Add Selected to Cart
        </Button>
        <Button
          variant='outlined'
          color='error'
          startIcon={<DeleteOutlineIcon />}
          onClick={handleRemoveSelected}
          disabled={!selectedItems.length}
        >
          Remove Selected
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: '1px solid #e0e0e0' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'>
                <Checkbox
                  checked={selectedItems.length === wishlist.products.length}
                  indeterminate={
                    selectedItems.length > 0 &&
                    selectedItems.length < wishlist.products.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderProducts()}</TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Select Options</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Color</InputLabel>
            <Select
              value={selectedColor}
              onChange={e => setSelectedColor(e.target.value)}
              label='Color'
            >
              {selectedProduct?.colors.map(color => (
                <MenuItem key={color._id} value={color.title}>
                  {color.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Size</InputLabel>
            <Select
              value={selectedSize}
              onChange={e => setSelectedSize(e.target.value)}
              label='Size'
            >
              {selectedProduct?.sizes.map(size => (
                <MenuItem key={size._id} value={size.title}>
                  {size.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmAddToCart}
            variant='contained'
            disabled={!selectedColor || !selectedSize}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Wishlist;
