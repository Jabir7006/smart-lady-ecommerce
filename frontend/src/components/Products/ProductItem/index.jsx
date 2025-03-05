import { memo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

const ProductItem = memo(({ product }) => {
  const aspectRatio = '100%'; // Define a fixed aspect ratio
  
  return (
    <div className="product-item" style={{ 
      aspectRatio: '3/4',
      contain: 'layout paint' 
    }}>
      <div className="product-image-wrapper" style={{
        position: 'relative',
        width: '100%',
        paddingTop: aspectRatio, // Maintain aspect ratio
        backgroundColor: '#f5f5f5', // Placeholder color
        overflow: 'hidden'
      }}>
        <LazyLoadImage
          src={product.image}
          alt={product.name}
          effect="opacity"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          width="100%"
          height="100%"
          placeholder={
            <div style={{ 
              width: '100%', 
              height: '100%', 
              backgroundColor: '#f5f5f5' 
            }} />
          }
        />
      </div>
      {/* Other product details */}
    </div>
  );
});

export default ProductItem;