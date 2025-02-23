import { Checkbox, FormControlLabel } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { Link, useSearchParams } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import ThemedSuspense from '../ThemedSuspense';
import { debounce } from 'lodash';

const Sidebar = ({ onFilterChange }) => {
  const [searchParams] = useSearchParams();

  // Initialize states with default values
  const [priceRange, setPriceRange] = useState([100, 60000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [stockStatus, setStockStatus] = useState({
    inStock: false,
    outOfStock: false,
  });

  // Fetch categories and brands
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories({
    limit: 100,
    sort: 'name',
    order: 'asc',
  });

  const { data: brandsData, isLoading: brandsLoading } = useBrands({
    limit: 100,
  });

  // Initialize state from URL params
  useEffect(() => {
    const categories =
      searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
    const minPrice = Number(searchParams.get('minPrice')) || 100;
    const maxPrice = Number(searchParams.get('maxPrice')) || 60000;
    const inStock = searchParams.get('inStock') === 'true';
    const outOfStock = searchParams.get('outOfStock') === 'true';

    setSelectedCategories(categories);
    setSelectedBrands(brands);
    setPriceRange([minPrice, maxPrice]);
    setStockStatus({ inStock, outOfStock });
  }, [searchParams]);

  // Debounce the filter change handler
  const debouncedFilterChange = useCallback(
    debounce(filters => {
      onFilterChange(filters);
    }, 500),
    [onFilterChange]
  );

  // Handle filter changes
  const handleCategoryChange = useCallback(
    categoryId => {
      setSelectedCategories(prev => {
        const updated = prev.includes(categoryId)
          ? prev.filter(id => id !== categoryId)
          : [...prev, categoryId];

        // Use setTimeout to avoid state updates during render
        setTimeout(() => {
          onFilterChange?.({ categories: updated });
        }, 0);

        return updated;
      });
    },
    [onFilterChange]
  );

  const handleBrandChange = useCallback(
    brandId => {
      setSelectedBrands(prev => {
        const updated = prev.includes(brandId)
          ? prev.filter(id => id !== brandId)
          : [...prev, brandId];

        setTimeout(() => {
          onFilterChange?.({ brands: updated });
        }, 0);

        return updated;
      });
    },
    [onFilterChange]
  );

  const handlePriceChange = useCallback(
    newRange => {
      setPriceRange(newRange);
      debouncedFilterChange({ priceRange: newRange });
    },
    [debouncedFilterChange]
  );

  const handleStockStatusChange = useCallback(
    status => {
      setStockStatus(prev => {
        const updated = { ...prev, [status]: !prev[status] };

        setTimeout(() => {
          onFilterChange?.({ stockStatus: updated });
        }, 0);

        return updated;
      });
    },
    [onFilterChange]
  );

  if (categoriesLoading || brandsLoading) {
    return <ThemedSuspense />;
  }

  return (
    <div className='sidebar'>
      <div className='filterBox'>
        <h6>PRODUCT CATEGORIES</h6>
        <div className='scroll'>
          <ul>
            {categoriesData?.categories?.map(category => (
              <li key={category._id}>
                <FormControlLabel
                  className='w-100'
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => handleCategoryChange(category._id)}
                    />
                  }
                  label={category.name}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className='filterBox'>
        <h6>FILTER BY PRICE</h6>
        <RangeSlider
          value={priceRange}
          onInput={handlePriceChange}
          min={100}
          max={60000}
          step={5}
        />
        <div className='d-flex pt-2 pb-2 priceRange'>
          <span>
            From: <strong className='text-dark'>Rs: {priceRange[0]}</strong>
          </span>
          <span className='ml-auto'>
            To: <strong className='text-dark'>Rs: {priceRange[1]}</strong>
          </span>
        </div>
      </div>

      <div className='filterBox'>
        <h6>PRODUCT STATUS</h6>
        <div className='scroll'>
          <ul>
            <li>
              <FormControlLabel
                className='w-100'
                control={
                  <Checkbox
                    checked={stockStatus.inStock}
                    onChange={() => handleStockStatusChange('inStock')}
                  />
                }
                label='In Stock'
              />
            </li>
            <li>
              <FormControlLabel
                className='w-100'
                control={
                  <Checkbox
                    checked={stockStatus.outOfStock}
                    onChange={() => handleStockStatusChange('outOfStock')}
                  />
                }
                label='Out of Stock'
              />
            </li>
          </ul>
        </div>
      </div>

      <div className='filterBox'>
        <h6>BRANDS</h6>
        <div className='scroll'>
          <ul>
            {brandsData?.brands?.map(brand => (
              <li key={brand._id}>
                <FormControlLabel
                  className='w-100'
                  control={
                    <Checkbox
                      checked={selectedBrands.includes(brand._id)}
                      onChange={() => handleBrandChange(brand._id)}
                    />
                  }
                  label={brand.title}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
