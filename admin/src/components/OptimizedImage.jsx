import React, { memo } from 'react';
import PropTypes from 'prop-types';

const OptimizedImage = memo(({ src, alt, className, width, height }) => {
  const generateSrcSet = (url) => {
    const sizes = [320, 640, 768, 1024, 1280];
    return sizes
      .map(size => `${url}?w=${size} ${size}w`)
      .join(', ');
  };

  return (
    <picture>
      <source
        type="image/webp"
        srcSet={generateSrcSet(src)}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
});

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage; 