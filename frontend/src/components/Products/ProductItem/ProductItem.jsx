import { Rating, Tooltip, Button } from '@mui/material';
import { IoMdHeartEmpty } from 'react-icons/io';
import { TfiFullscreen } from 'react-icons/tfi';
import { Link, useSearchParams } from 'react-router-dom';
import { memo, useCallback, useContext, useState } from 'react';
import GlobalContext from '../../../context/GlobalContext';
import calculateDiscountPercentage from '../../../utils/discountPercentage';
import { BiCartAdd } from 'react-icons/bi';
import { useCart } from '../../../hooks/useCart';
import { useWishlist } from '../../../hooks/useWishlist';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import placeholderImage from '../../../assets/images/placeholder.png';

export default function ProductItem({ product, itemView }) {
  const { setisOpenProductModal, setProductId } = useContext(GlobalContext);
  const { addToCart, isLoading: isAddingToCart } = useCart();
  const { addToWishlist, isLoading: isAddingToWishlist } = useWishlist();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0]?.title || ''
  );
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes[0]?.title || ''
  );

  const viewProductDetails = useCallback(() => {
    setisOpenProductModal(true);
    setProductId(product?._id);
  }, [product?._id, setisOpenProductModal, setProductId]);

  const discountPercentage = calculateDiscountPercentage(
    product?.regularPrice,
    product?.discountPrice
  );

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
    });
  };

  const handleAddToWishlist = () => {
    addToWishlist(product._id);
  };

  return (
    <>
      <div className={`productItem ${itemView}`}>
        <div className='img_rapper'>
          <Link to={`/product/${product?._id}`}>
            <div className='productItemSliderWrapper'>
              <div className='img1 transition'>
                <span className='lazy-load-image-background blur lazy-load-image-loaded'>
                  <LazyLoadImage
                    alt='image'
                    src={product?.images[0]?.url}
                    effect='opacity'
                    placeholderSrc={placeholderImage}
                    className='w-100'
                  />
                </span>
              </div>
              <div className='img2 transition'>
                <span className='lazy-load-image-background blur lazy-load-image-loaded'>
                  <LazyLoadImage
                    alt='image'
                    src={product?.images[1]?.url}
                    effect='opacity'
                    placeholderSrc={placeholderImage}
                    className='w-100'
                  />
                </span>
              </div>
            </div>
          </Link>

          <span className='badge badge-primary'>{discountPercentage}%</span>
          <div className='actions'>
            <Tooltip title='Quick View' placement='left'>
              <Button onClick={viewProductDetails}>
                <TfiFullscreen />
              </Button>
            </Tooltip>
            <Tooltip title='Add to Wishlist' placement='left'>
              <Button
                onClick={handleAddToWishlist}
                disabled={isAddingToWishlist}
              >
                <IoMdHeartEmpty size={20} />
              </Button>
            </Tooltip>
            <Tooltip title='Add to Cart' placement='left'>
              <Button onClick={handleAddToCart} disabled={isAddingToCart}>
                <BiCartAdd size={20} />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className='info'>
          <Link to={`/product/${product?._id}`}>
            <h4>{product?.title}</h4>
          </Link>
          <span className='text-success d-block'>In Stock</span>
          <Rating
            name='read-only'
            value={product?.totalRating}
            readOnly
            size='small'
            precision={0.5}
            className='mt-2 mb-2'
          />
          <div className='d-flex'>
            <span className='oldPrice'>TK {product?.regularPrice}</span>
            <span className='netPrice text-danger ml-2'>
              TK {product?.discountPrice}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
