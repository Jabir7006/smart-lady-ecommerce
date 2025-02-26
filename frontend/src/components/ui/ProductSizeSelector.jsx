import React, { useState } from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  '& .MuiToggleButtonGroup-grouped': {
    margin: 0,
    border: '1px solid #e0e0e0',
    '&:not(:first-of-type)': {
      borderRadius: '8px',
      borderLeft: '1px solid #e0e0e0',
    },
    '&:first-of-type': {
      borderRadius: '8px',
    },
  },
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  minWidth: '45px',
  height: '45px',
  padding: '0 16px',
  textTransform: 'uppercase',
  fontWeight: 500,
  fontSize: '14px',
  color: '#495057',
  backgroundColor: '#fff',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#f8f9fa',
    borderColor: '#adb5bd',
  },
  '&.Mui-selected': {
    backgroundColor: '#6d4aae !important',
    color: '#fff !important',
    borderColor: '#6d4aae !important',
    '&:hover': {
      backgroundColor: '#5b3d94 !important',
      borderColor: '#5b3d94 !important',
    },
  },
}));

const ProductSizeSelector = ({ sizes, onSelect }) => {
  const [selectedSize, setSelectedSize] = useState('');

  const handleSizeChange = (event, newSize) => {
    if (newSize !== null) {
      setSelectedSize(newSize);
      onSelect(newSize);
    }
  };

  return (
    <Box className='size-selector'>
      <Stack spacing={1.5}>
        <Typography
          variant='subtitle2'
          fontWeight={600}
          color='text.primary'
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          Size
          {sizes?.length > 0 && (
            <Typography
              component='span'
              variant='caption'
              color='text.secondary'
              sx={{ ml: 0.5 }}
            >
              ({sizes.length} available)
            </Typography>
          )}
        </Typography>

        <StyledToggleButtonGroup
          value={selectedSize}
          exclusive
          onChange={handleSizeChange}
          aria-label='product size'
        >
          {sizes?.map((size, index) => (
            <StyledToggleButton
              key={index}
              value={size.title}
              aria-label={size.title}
            >
              {size.title}
            </StyledToggleButton>
          ))}
        </StyledToggleButtonGroup>
      </Stack>
    </Box>
  );
};

export default ProductSizeSelector;
