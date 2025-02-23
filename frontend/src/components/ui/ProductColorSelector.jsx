import React, { useState } from 'react';

const ProductColorSelector = ({ colors, onSelect }) => {
  const [activeColor, setActiveColor] = useState(null);

  const handleColor = color => {
    setActiveColor(color);
    onSelect(color);
  };

  return (
    <div className='productColor d-flex flex-column'>
      <span>Color:</span>
      <ul className='list list-inline mb-0 mt-2'>
        {colors.map((color, index) => (
          <li className='list-inline-item' key={index}>
            <div className='d-flex flex-column align-items-center'>
              <a
                className={`tag ${activeColor === color.title ? 'active' : ''}`}
                onClick={() => handleColor(color.title)}
                style={{ backgroundColor: color.title }}
              >
                {color.title}
              </a>
              <span className='color-title'>{color.title}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductColorSelector;
