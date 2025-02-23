import {
  Button,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import ProductZoom from '../../components/Modals/ProductModal/ProductZoom';
import QuantityBox from '../../components/Home/QuantityBox';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { IoIosHeartEmpty } from 'react-icons/io';
import ProductDetailsTabs from '../../components/Products/ProductDetails/ProductDetailsTabs';
import RelatedProducts from './RelatedProducts';

import { useProduct } from '../../hooks/useProducts';
import ThemedSuspense from '../../components/ThemedSuspense';
import { useParams } from 'react-router-dom';
import calculateDiscountPercentage from '../../utils/discountPercentage';
import generateShortDescription from '../../utils/generateShortDescription';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useState, useEffect } from 'react';
import ProductColorSelector from '../../components/ui/ProductColorSelector';
import ProductSizeSelector from '../../components/ui/ProductSizeSelector';
import { toast } from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useProduct(id);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const product = data?.data;

  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0]?.title || ''
  );
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes[0]?.title || ''
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const handleAddToWishlist = () => {
    addToWishlist(product._id);
  };

  return (
    <section className='productDetails section'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-4 pl-5'>
            <ProductZoom
              images={product?.images}
              discountPercentage={calculateDiscountPercentage(
                product?.regularPrice,
                product?.discountPrice
              )}
            />
          </div>
          <div className='col-md-7 pl-5 pr-5'>
            <h2 className='hd text-capitalize'>{product?.title}</h2>

            <ul className='list list-inline d-flex align-items-center'>
              <li className='list-inline-item'>
                <div className='d-flex align-items-center'>
                  <span className='text-muted mr-2'>Brands: </span>
                  <span>{product?.brand?.title}</span>
                </div>
              </li>
              <li className='list-inline-item'>
                <div className='d-flex align-items-center'>
                  <Rating
                    name='read-only'
                    value={product?.rating}
                    precision={0.5}
                    readOnly
                    size='small'
                  />
                  <span className='text-muted cursor ml-2'>
                    {product?.totalrating} Review
                  </span>
                </div>
              </li>
            </ul>
            {product?.discountPrice ? (
              <div className='d-flex info mb-3'>
                <span className='oldPrice'>BDT {product?.regularPrice}</span>
                <span className='netPrice text-danger ml-2'>
                  BDT {product?.discountPrice}
                </span>
              </div>
            ) : (
              <div className='d-flex info mb-3'>
                <span className='oldPrice'>BDT {product?.regularPrice}</span>
              </div>
            )}

            <span className='badge badge-success'>
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
                onSelect={size => {
                  console.log('Selected Size:', size);
                  setSelectedSize(size);
                }}
              />
            </div>

            <div className='d-flex align-items-center mt-4'>
              <QuantityBox
                defaultValue={1}
                onChange={value => setQuantity(value)}
              />
              <Button
                className='btn-blue btn-lg btn-big btn-round btn-cart'
                onClick={handleAddToCart}
              >
                <ShoppingCartIcon /> &nbsp; Add to cart
              </Button>

              <Button
                className='btn-success btn-lg btn-big btn-round ml-2 btn-wishlist'
                onClick={handleAddToWishlist}
              >
                <IoIosHeartEmpty size={23} /> &nbsp; Add to wishlist
              </Button>
            </div>
          </div>
        </div>

        <br />

        <ProductDetailsTabs product={product} />

        <br />

        <RelatedProducts />
      </div>
    </section>
  );
};

export default ProductDetails;
