import React, { memo } from 'react';
import PropTypes from 'prop-types';

const OptimizedImage = memo(({ src, alt, className, width, height }) => {
  const generateSrcSet = (url) => {
    const sizes = [320, 640, 768, 1024, 1280];
    return sizes
      .map(size => `${url}?w=${size}&q=75 ${size}w`)
      .join(', ');
  };

  const aspectRatio = width && height ? { paddingTop: `${(height / width) * 100}%` } : {};

  return (
    <div className="image-wrapper" style={aspectRatio}>
      <picture>
        <source
          type="image/webp"
          srcSet={generateSrcSet(src)}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <img
          src={`${src}?w=640&q=75`}
          alt={alt}
          className={`${className} lazy-image`}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
        />
      </picture>
    </div>
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