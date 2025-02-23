import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';
import CircularProgress from '@mui/material/CircularProgress';
import { useSearchParams } from 'react-router-dom';

const ScrollableTabs = ({ onCategoryChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(0);
  const { data: categoriesData, isLoading } = useCategories({
    limit: 100,
    sort: 'name',
    order: 'asc',
  });

  useEffect(() => {
    const categories = searchParams.get('categories')?.split(',') || [];
    const singleCategory = searchParams.get('category');

    if (categoriesData?.categories) {
      if (categories.length > 0) {
        const index = categoriesData.categories.findIndex(
          cat => cat._id === categories[0]
        );
        setValue(index !== -1 ? index + 1 : 0);
      } else if (singleCategory) {
        const index = categoriesData.categories.findIndex(
          cat => cat._id === singleCategory
        );
        setValue(index !== -1 ? index + 1 : 0);
      } else {
        setValue(0);
      }
    }
  }, [categoriesData, searchParams]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const selectedCategory =
      newValue === 0 ? '' : categoriesData?.categories[newValue - 1]._id;

    const params = new URLSearchParams(searchParams);
    if (selectedCategory) {
      params.set('categories', selectedCategory);
      params.set('category', selectedCategory);
    } else {
      params.delete('categories');
      params.delete('category');
    }
    setSearchParams(params);
    onCategoryChange(selectedCategory);
  };

  return (
    <Box
      sx={{
        maxWidth: { xs: 320, sm: 480 },
        bgcolor: 'background.paper',
        position: 'relative',
        minHeight: '48px',
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Tabs
          value={value}
          onChange={handleChange}
          variant='scrollable'
          scrollButtons='auto'
          aria-label='category tabs'
        >
          <Tab label='All' />
          {categoriesData?.categories?.map(category => (
            <Tab key={category._id} label={category.name} />
          ))}
        </Tabs>
      )}
    </Box>
  );
};

export default ScrollableTabs;
