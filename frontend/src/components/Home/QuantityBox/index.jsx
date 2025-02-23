import { Button } from '@mui/material';
import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';

const QuantityBox = ({ defaultValue = 1, onChange }) => {
  const [inputVal, setInputVal] = useState(defaultValue);

  const minus = () => {
    if (inputVal > 1) {
      const newValue = inputVal - 1;
      setInputVal(newValue);
      onChange?.(newValue);
    }
  };

  const plus = () => {
    const newValue = inputVal + 1;
    setInputVal(newValue);
    onChange?.(newValue);
  };

  return (
    <div className='quantityDrop d-flex align-items-center'>
      <Button onClick={minus}>
        <FaMinus />
      </Button>
      <input type='text' value={inputVal} readOnly />
      <Button onClick={plus}>
        <FaPlus />
      </Button>
    </div>
  );
};

export default QuantityBox;
