import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
  Typography,
  Slider,
  FormGroup,
  Divider,
  Box,
  Chip,
  Button,
} from '@mui/material';
import { FaChevronDown } from 'react-icons/fa';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import './Sidebar.css';

const Sidebar = ({ onFilterChange, initialFilters }) => {
  const { data: categoriesData } = useCategories({
    limit: 100,
    sort: 'name',
    order: 'asc',
  });
  const { data: brandsData } = useBrands({
    limit: 100,
    sort: 'title',
    order: 'asc',
  });
  const [expanded, setExpanded] = useState([
    'categories',
    'price',
    'brands',
    'availability',
  ]);

  // Temporary state for filters before applying
  const [tempFilters, setTempFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [100, 60000],
    stockStatus: {
      inStock: false,
      outOfStock: false,
    },
  });

  // State to track if filters have been modified
  const [isModified, setIsModified] = useState(false);

  // Initialize filters from URL params on component mount
  useEffect(() => {
    if (initialFilters) {
      setTempFilters(initialFilters);
    }
  }, [initialFilters]);

  // Add console logs to check the data
  useEffect(() => {
    console.log('Categories Data:', categoriesData);
    console.log('Brands Data:', brandsData);
  }, [categoriesData, brandsData]);

  // Handle accordion expansion
  const handleAccordionChange = panel => (event, isExpanded) => {
    setExpanded(prev =>
      isExpanded ? [...prev, panel] : prev.filter(p => p !== panel)
    );
  };

  // Handle category selection
  const handleCategoryChange = categoryId => {
    setTempFilters(prev => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId];

      setIsModified(true);
      return { ...prev, categories: newCategories };
    });
  };

  // Handle brand selection
  const handleBrandChange = brandId => {
    setTempFilters(prev => {
      const newBrands = prev.brands.includes(brandId)
        ? prev.brands.filter(id => id !== brandId)
        : [...prev.brands, brandId];

      setIsModified(true);
      return { ...prev, brands: newBrands };
    });
  };

  // Handle price range change
  const handlePriceChange = (event, newValue) => {
    setTempFilters(prev => {
      setIsModified(true);
      return { ...prev, priceRange: newValue };
    });
  };

  // Handle stock status change
  const handleStockStatusChange = status => {
    setTempFilters(prev => {
      const newStockStatus = {
        ...prev.stockStatus,
        [status]: !prev.stockStatus[status],
      };
      setIsModified(true);
      return { ...prev, stockStatus: newStockStatus };
    });
  };

  // Apply filters
  const applyFilters = () => {
    onFilterChange(tempFilters);
    setIsModified(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const defaultFilters = {
      categories: [],
      brands: [],
      priceRange: [100, 60000],
      stockStatus: {
        inStock: false,
        outOfStock: false,
      },
    };
    setTempFilters(defaultFilters);
    onFilterChange(defaultFilters);
    setIsModified(false);
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    count += tempFilters.categories.length;
    count += tempFilters.brands.length;
    if (
      tempFilters.priceRange[0] !== 100 ||
      tempFilters.priceRange[1] !== 60000
    )
      count++;
    if (tempFilters.stockStatus.inStock) count++;
    if (tempFilters.stockStatus.outOfStock) count++;
    return count;
  };

  return (
    <div className='filters-sidebar'>
      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <Box className='active-filters'>
          <div className='active-filters-header'>
            <Typography variant='subtitle2'>Active Filters</Typography>
            <Typography
              variant='body2'
              className='clear-all'
              onClick={clearAllFilters}
            >
              Clear All
            </Typography>
          </div>
          <div className='filter-chips'>
            {tempFilters.categories.map(catId => {
              const category = categoriesData?.categories?.find(
                c => c._id === catId
              );
              return (
                category && (
                  <Chip
                    key={catId}
                    label={category.name}
                    onDelete={() => handleCategoryChange(catId)}
                    size='small'
                  />
                )
              );
            })}
            {tempFilters.brands.map(brandId => {
              const brand = brandsData?.brands?.find(b => b._id === brandId);
              return (
                brand && (
                  <Chip
                    key={brandId}
                    label={brand.title}
                    onDelete={() => handleBrandChange(brandId)}
                    size='small'
                  />
                )
              );
            })}
            {(tempFilters.priceRange[0] !== 100 ||
              tempFilters.priceRange[1] !== 60000) && (
              <Chip
                label={`৳${tempFilters.priceRange[0]} - ৳${tempFilters.priceRange[1]}`}
                onDelete={() => handlePriceChange(null, [100, 60000])}
                size='small'
              />
            )}
          </div>
          <Divider className='mt-3' />
        </Box>
      )}

      {/* Categories */}
      <Accordion
        expanded={expanded.includes('categories')}
        onChange={handleAccordionChange('categories')}
        className='filter-accordion'
      >
        <AccordionSummary expandIcon={<FaChevronDown />}>
          <Typography>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup className='scrollable-filter-group'>
            {categoriesData?.categories?.map(category => (
              <FormControlLabel
                key={category._id}
                control={
                  <Checkbox
                    checked={tempFilters.categories.includes(category._id)}
                    onChange={() => handleCategoryChange(category._id)}
                    size='small'
                  />
                }
                label={
                  <div className='filter-label'>
                    <span>{category.name}</span>
                    <span className='count'>
                      ({category.totalProducts || 0})
                    </span>
                  </div>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Price Range */}
      <Accordion
        expanded={expanded.includes('price')}
        onChange={handleAccordionChange('price')}
        className='filter-accordion'
      >
        <AccordionSummary expandIcon={<FaChevronDown />}>
          <Typography>Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className='price-range'>
            <Slider
              value={tempFilters.priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay='auto'
              min={100}
              max={60000}
              step={100}
            />
            <div className='price-inputs'>
              <Typography variant='body2'>
                ৳{tempFilters.priceRange[0]} - ৳{tempFilters.priceRange[1]}
              </Typography>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Brands */}
      <Accordion
        expanded={expanded.includes('brands')}
        onChange={handleAccordionChange('brands')}
        className='filter-accordion'
      >
        <AccordionSummary expandIcon={<FaChevronDown />}>
          <Typography>Brands</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup className='scrollable-filter-group'>
            {brandsData?.brands?.map(brand => (
              <FormControlLabel
                key={brand._id}
                control={
                  <Checkbox
                    checked={tempFilters.brands.includes(brand._id)}
                    onChange={() => handleBrandChange(brand._id)}
                    size='small'
                  />
                }
                label={
                  <div className='filter-label'>
                    <span>{brand.title}</span>
                    <span className='count'>({brand.totalProducts || 0})</span>
                  </div>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Availability */}
      <Accordion
        expanded={expanded.includes('availability')}
        onChange={handleAccordionChange('availability')}
        className='filter-accordion'
      >
        <AccordionSummary expandIcon={<FaChevronDown />}>
          <Typography>Availability</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempFilters.stockStatus.inStock}
                  onChange={() => handleStockStatusChange('inStock')}
                  size='small'
                />
              }
              label='In Stock'
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={tempFilters.stockStatus.outOfStock}
                  onChange={() => handleStockStatusChange('outOfStock')}
                  size='small'
                />
              }
              label='Out of Stock'
            />
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Apply Filters Button */}
      <div className='filter-actions'>
        <Button
          variant='contained'
          fullWidth
          onClick={applyFilters}
          disabled={!isModified}
          className='apply-filters-btn'
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
