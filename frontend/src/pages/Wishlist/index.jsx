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
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { IoMdHeartEmpty } from 'react-icons/io';
import {
  IoBagOutline,
  IoTrashOutline,
  IoArrowForwardOutline,
} from 'react-icons/io5';
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
    return (
      <div className='wishlist-loading'>
        <ThemedSuspense />
      </div>
    );
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
      toast.success('Items added to cart');
    } catch (error) {
      console.error('Error adding selected items to cart:', error);
      toast.error('Failed to add some items to cart');
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
      toast.success('Selected items removed');
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
            <Box sx={{ ml: 2 }}>
              <Link
                to={`/product/${product._id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Typography variant='subtitle1' sx={{ mb: 1 }}>
                  {product.title}
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

  const renderMobileProducts = () => {
    if (!wishlist?.products) return null;

    return wishlist.products.map(product => (
      <Card className='wishlist-item-card' key={product._id}>
        <div className='wishlist-item-header'>
          <div className='wishlist-checkbox'>
            <Checkbox
              checked={selectedItems.includes(product._id)}
              onChange={() => handleSelectItem(product._id)}
            />
          </div>
          <Link to={`/product/${product._id}`} className='wishlist-item-image'>
            <img
              src={product.images[0]?.url}
              alt={product.title}
              loading='lazy'
            />
          </Link>
          <div className='wishlist-item-details'>
            <Link to={`/product/${product._id}`}>
              <h3>
                {product.title?.substring(0, 30)}
                {product.title?.length > 30 ? '...' : ''}
              </h3>
            </Link>
            <div className='wishlist-item-rating'>
              <Rating value={product.rating || 0} readOnly size='small' />
              <span>({product.numReviews || 0})</span>
            </div>
            <div className='wishlist-item-price'>
              <strong>
                {product.discountPrice || product.regularPrice} TK
              </strong>
              {product.discountPrice && (
                <span className='old-price'>{product.regularPrice} TK</span>
              )}
            </div>
            <div className='wishlist-item-stock'>
              {product.quantity > 0 ? (
                <span className='in-stock'>In Stock</span>
              ) : (
                <span className='out-of-stock'>Out of Stock</span>
              )}
            </div>
          </div>
          <IconButton
            className='remove-wishlist-item'
            onClick={() => handleRemoveFromWishlist(product._id)}
            disabled={isRemoving === product._id}
          >
            <IoTrashOutline />
          </IconButton>
        </div>
        <div className='wishlist-item-footer'>
          <Button
            variant='contained'
            fullWidth
            startIcon={<IoBagOutline />}
            onClick={() => handleAddToCart(product)}
            disabled={product.quantity === 0}
            className='add-to-cart-btn'
          >
            Add to Cart
          </Button>
        </div>
      </Card>
    ));
  };

  if (!wishlist?.products?.length) {
    return (
      <div className='empty-wishlist-container'>
        <div className='empty-wishlist'>
          <div className='empty-wishlist-icon'>
            <IoMdHeartEmpty />
          </div>
          <h2>Your Wishlist is Empty</h2>
          <p>
            Add items that you like to your wishlist. Review them anytime and
            easily move them to the cart.
          </p>
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
    <section className='wishlist-section'>
      <Container>
        <div className='wishlist-header'>
          <h1>My Wishlist</h1>
          <p>
            You have <span>{wishlist.products.length}</span>{' '}
            {wishlist.products.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>

        <div className='wishlist-actions'>
          <Button
            variant='contained'
            startIcon={<IoBagOutline />}
            onClick={handleAddSelectedToCart}
            disabled={!selectedItems.length}
            className='add-selected-btn'
          >
            Add Selected to Cart
          </Button>
          <Button
            variant='outlined'
            color='error'
            startIcon={<IoTrashOutline />}
            onClick={handleRemoveSelected}
            disabled={!selectedItems.length}
            className='remove-selected-btn'
          >
            Remove Selected
          </Button>
        </div>

        {/* Desktop View */}
        <div className='wishlist-table-container desktop-wishlist'>
          <TableContainer
            component={Paper}
            elevation={0}
            className='wishlist-table-wrapper'
          >
            <Table className='wishlist-table'>
              <TableHead>
                <TableRow>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      checked={
                        selectedItems.length === wishlist.products.length
                      }
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
        </div>

        {/* Mobile View */}
        <div className='mobile-wishlist'>
          <div className='wishlist-select-all'>
            <Checkbox
              checked={selectedItems.length === wishlist.products.length}
              indeterminate={
                selectedItems.length > 0 &&
                selectedItems.length < wishlist.products.length
              }
              onChange={handleSelectAll}
            />
            <span>Select All Items</span>
          </div>
          {renderMobileProducts()}
        </div>

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
    </section>
  );
};

export default Wishlist;
