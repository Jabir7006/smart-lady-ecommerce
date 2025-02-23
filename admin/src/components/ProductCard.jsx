import React, { memo } from 'react';
import { Card, CardBody, Badge } from '@windmill/react-ui';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { EditIcon, EyeIcon, TrashIcon } from '../icons';
import { Button } from '@windmill/react-ui';
import OptimizedImage from './OptimizedImage';
import { errorTracker } from '../services/errorTracking';
import { performanceMonitor } from '../services/performanceMonitoring';

const ProductCard = memo(({ product, onDelete }) => {
  // Start performance measurement
  React.useEffect(() => {
    performanceMonitor.startMeasure(`product-card-${product._id}`);
    return () => performanceMonitor.endMeasure(`product-card-${product._id}`);
  }, [product._id]);

  const handleDeleteClick = React.useCallback(() => {
    try {
      onDelete?.(product._id);
    } catch (error) {
      errorTracker.captureError(error, {
        component: 'ProductCard',
        action: 'delete',
        productId: product._id
      });
    }
  }, [product._id, onDelete]);

  const {
    _id,
    title,
    description,
    images,
    regularPrice,
    discountPrice,
    quantity,
    category,
    brand
  } = product;

  return (
    <Card className="h-full flex flex-col">
      <CardBody className="flex flex-col flex-grow">
        <div className="relative">
          <OptimizedImage 
            src={images[0]?.url}
            alt={title}
            className="object-cover w-full h-48"
            width={384}
            height={192}
          />
          {discountPrice < regularPrice && (
            <Badge type="danger" className="absolute top-2 right-2">
              Sale
            </Badge>
          )}
        </div>
        <div className="mt-4">
          <Link 
            to={`/app/product/${_id}`}
            className="text-lg font-semibold text-gray-700 dark:text-gray-200"
          >
            {title}
          </Link>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {category?.name || '-'} | {brand?.title || '-'}
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {description.substring(0, 100)}...
          </p>
          <div className="flex justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-purple-600">
                ${discountPrice}
              </span>
              {discountPrice < regularPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${regularPrice}
                </span>
              )}
            </div>
            <Badge type={quantity > 0 ? "success" : "danger"}>
              {quantity > 0 ? `In Stock (${quantity})` : "Out of Stock"}
            </Badge>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <Link to={`/app/product/${_id}`}>
              <Button
                icon={EyeIcon}
                className="mr-2"
                size="small"
                aria-label="Preview"
              />
            </Link>
            <Link to={`/app/product/edit/${_id}`}>
              <Button
                icon={EditIcon}
                className="mr-2"
                layout="outline"
                size="small"
                aria-label="Edit"
              />
            </Link>
            <Button
              icon={TrashIcon}
              layout="outline"
              size="small"
              onClick={handleDeleteClick}
              aria-label="Delete"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
});

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired
      })
    ).isRequired,
    regularPrice: PropTypes.number.isRequired,
    discountPrice: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    category: PropTypes.shape({
      name: PropTypes.string
    }),
    brand: PropTypes.shape({
      title: PropTypes.string
    })
  }).isRequired,
  onDelete: PropTypes.func
};

ProductCard.displayName = 'ProductCard';

export default ProductCard; 