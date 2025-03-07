import { Rating, Tooltip, Button } from '@mui/material';
import { IoMdHeartEmpty } from 'react-icons/io';
import { TfiFullscreen } from 'react-icons/tfi';
import { Link, useSearchParams } from 'react-router-dom';
import { memo, useCallback, useContext, useState, useMemo } from 'react';
import GlobalContext from '../../../context/GlobalContext';
import calculateDiscountPercentage from '../../../utils/discountPercentage';
import { BiCartAdd } from 'react-icons/bi';
import { useCart } from '../../../hooks/useCart';
import { useWishlist } from '../../../hooks/useWishlist';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

const ProductItem = memo(({ product, itemView }) => {
  const { setisOpenProductModal, setProductId } = useContext(GlobalContext);
  const { addToCart, isLoading: isAddingToCart } = useCart();
  const { addToWishlist, isLoading: isAddingToWishlist } = useWishlist();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');

  const discountPercentage = useMemo(
    () =>
      calculateDiscountPercentage(
        product?.regularPrice,
        product?.discountPrice
      ),
    [product?.regularPrice, product?.discountPrice]
  );

  const viewProductDetails = useCallback(
    e => {
      e.preventDefault();
      setisOpenProductModal(true);
      setProductId(product?._id);
    },
    [product?._id, setisOpenProductModal, setProductId]
  );

  const handleAddToCart = useCallback(() => {
    addToCart({
      productId: product._id,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
    });
  }, [product._id, selectedColor, selectedSize, addToCart]);

  const handleAddToWishlist = useCallback(() => {
    addToWishlist(product._id);
  }, [product._id, addToWishlist]);

  const productUrl = useMemo(() => `/product/${product?._id}`, [product?._id]);

  const highlightedTitle = useMemo(() => {
    if (!searchTerm || !product?.title) return product?.title;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return product.title.replace(
      regex,
      '<mark class="highlight-match">$1</mark>'
    );
  }, [product?.title, searchTerm]);

  // Ensure title is always a string, not a React element
  const title =
    typeof product.title === 'string'
      ? product.title
      : product.title?.props?.dangerouslySetInnerHTML?.__html || product.title;
  const description =
    typeof product.description === 'string'
      ? product.description
      : product.description?.props?.dangerouslySetInnerHTML?.__html ||
        product.description;

  return (
    <>
      <div className={`productItem ${itemView}`}>
        <div className='img_rapper'>
          <Link to={productUrl}>
            <div className='productItemSliderWrapper'>
              <div className='img1 transition'>
                <span className='lazy-load-image-background blur lazy-load-image-loaded'>
                  <LazyLoadImage
                    alt='Product Image'
                    src={product?.thumbnail}
                    effect='opacity'
                    placeholderSrc='https://res.cloudinary.com/dshdu9ptb/image/upload/f_auto,q_auto/uofezgmknqytyytg95ah'
                    className='w-100'
                    loading='eager' // Loads immediately for LCP optimization
                    fetchpriority='high' // High priority for faster load
                  />
                </span>
              </div>
              <div className='img2 transition hover-only'>
                <span className='lazy-load-image-background blur lazy-load-image-loaded'>
                  <LazyLoadImage
                    alt='Product Hover Image'
                    src={product?.secondaryImage || product?.thumbnail}
                    effect='opacity'
                    placeholderSrc='https://res.cloudinary.com/dshdu9ptb/image/upload/f_auto,q_auto/uofezgmknqytyytg95ah'
                    className='w-100'
                    loading='lazy'
                  />
                </span>
              </div>
            </div>
          </Link>

          <span className='badge badge-danger'>{discountPercentage}% OFF</span>
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
          <Link to={productUrl}>
            <h4 dangerouslySetInnerHTML={{ __html: highlightedTitle }}></h4>
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
});

export default ProductItem;
