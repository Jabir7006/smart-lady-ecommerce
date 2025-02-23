import { Button, Dialog, Rating } from '@mui/material';

import 'swiper/css';
import 'swiper/css/navigation';
import { MdClose, MdOutlineCompareArrows } from 'react-icons/md';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import QuantityBox from '../../Home/QuantityBox';
import { IoIosHeart } from 'react-icons/io';

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

  return (
    <Dialog
      open={true}
      className='productModal'
      style={{
        opacity: 1,
        transition: 'opacity 225ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onClose={() => setisOpenProductModal(false)}
    >
      <Button className='close_' onClick={() => setisOpenProductModal(false)}>
        <MdClose />
      </Button>
      <h4 className='mb-1 font-weight-bold pr-5'>{product?.title}</h4>
      <div className='d-flex align-items-center'>
        <div className='d-flex align-items-center mr-4'>
          <span>Brands: </span>
          <span className='ml-2'>
            <b>{product?.brand?.title}</b>{' '}
          </span>
        </div>
        <Rating
          name='read-only'
          value={product?.totalrating || 0}
          size='small'
          precision={0.5}
          readOnly
        />
      </div>
      <hr />

      <div className='row mt-2 productDetailsModal'>
        <div className='col-md-5'>
          <ProductZoom images={product?.images} />
        </div>

        <div className='col-md-7'>
          <div className='d-flex info align-items-center mb-3'>
            <span className='oldPrice lg mr-2'>
              TK : {product?.regularPrice}
            </span>
            <span className='netPrice text-danger lg'>
              TK : {product?.discountPrice}
            </span>
          </div>
          <span className='badge bg-success'>
            {product?.quantity === 0
              ? 'OUT OF STOCK'
              : product?.quantity < 10
                ? 'LOW STOCK'
                : 'IN STOCK'}
          </span>

          <p
            className='mt-3'
            dangerouslySetInnerHTML={{
              __html: generateShortDescription(product?.description),
            }}
          />

          <div className='mt-3'>
            <ProductColorSelector
              colors={product?.colors}
              onSelect={setSelectedColor}
            />
            <ProductSizeSelector
              sizes={product?.sizes}
              onSelect={size => setSelectedSize(size)}
            />
          </div>

          <div className='d-flex align-items-center actions_'>
            <QuantityBox
              defaultValue={1}
              onChange={value => setQuantity(value)}
            />

            <Button
              className='btn-blue btn-lg btn-big btn-round ml-3'
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>

          <div className='d-flex align-items-center mt-5 actions'>
            <Button className='btn-round btn-sml' variant='outlined'>
              <IoIosHeart /> &nbsp; ADD TO WISHLIST
            </Button>
            <Button className='btn-round btn-sml ml-3' variant='outlined'>
              <MdOutlineCompareArrows /> &nbsp; COMPARE
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProductModal;
