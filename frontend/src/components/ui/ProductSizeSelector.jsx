import React, { useState } from 'react';

const ProductSizeSelector = ({ sizes, onSelect }) => {
  const [activeSize, setActiveSize] = useState(null);

  const handleSize = size => {
    setActiveSize(size);
    onSelect(size);
  };

  return (
    <div className='productSize d-flex align-items-center'>
      <span>Size:</span>
      <ul className='list list-inline mb-0 pl-4'>
        {sizes.map((size, index) => (
          <li className='list-inline-item' key={index}>
            <a
              className={`tag ${activeSize === size.title ? 'active' : ''}`}
              onClick={() => handleSize(size.title)}
            >
              {size.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductSizeSelector;
