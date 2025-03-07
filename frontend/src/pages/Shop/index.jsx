import { useState, useMemo, useCallback, useEffect } from 'react';
import { FiFilter, FiSearch } from 'react-icons/fi';
import Sidebar from '../../components/Sidebar';
import {
  Button,
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import ProductItem from '../../components/Products/ProductItem/ProductItem';
import { useProducts } from '../../hooks/useProducts';
import ThemedSuspense from '../../components/ThemedSuspense';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import './Shop.css';
import { BsInboxes } from 'react-icons/bs';

const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || !text) return text;
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<span class="highlight-match">$1</span>');
};

const Shop = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [view, setView] = useState('four');
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Memoize initial filters
  const initialFilters = useMemo(
    () => ({
      categories:
        searchParams.get('categories')?.split(',').filter(Boolean) || [],
      brands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
      priceRange: [
        Number(searchParams.get('minPrice')) || 100,
        Number(searchParams.get('maxPrice')) || 60000,
      ],
      stockStatus: {
        inStock: searchParams.get('inStock') === 'true',
        outOfStock: searchParams.get('outOfStock') === 'true',
      },
    }),
    [searchParams]
  );

  const [filters, setFilters] = useState(initialFilters);

  // Fetch data with React Query hooks
  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const { data: productsData, isLoading } = useProducts({
    page,
    limit,
    search: searchTerm,
    category: filters.categories.join(','),
    brand: filters.brands.join(','),
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
    inStock: filters.stockStatus.inStock,
    outOfStock: filters.stockStatus.outOfStock,
  });

  // Memoize URL params update
  const updateUrlParams = useCallback(
    newFilters => {
      const params = new URLSearchParams(searchParams);

      if (newFilters.categories?.length) {
        params.set('categories', newFilters.categories.join(','));
      } else {
        params.delete('categories');
      }

      if (newFilters.brands?.length) {
        params.set('brands', newFilters.brands.join(','));
      } else {
        params.delete('brands');
      }

      params.set('minPrice', newFilters.priceRange[0]);
      params.set('maxPrice', newFilters.priceRange[1]);

      if (newFilters.stockStatus.inStock) {
        params.set('inStock', 'true');
      } else {
        params.delete('inStock');
      }

      if (newFilters.stockStatus.outOfStock) {
        params.set('outOfStock', 'true');
      } else {
        params.delete('outOfStock');
      }

      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    newFilters => {
      setFilters(newFilters);
      setPage(1); // Reset page when filters change

      const params = new URLSearchParams();
      if (newFilters.categories.length)
        params.set('categories', newFilters.categories.join(','));
      if (newFilters.brands.length)
        params.set('brands', newFilters.brands.join(','));
      if (newFilters.priceRange[0] !== 100)
        params.set('minPrice', newFilters.priceRange[0]);
      if (newFilters.priceRange[1] !== 60000)
        params.set('maxPrice', newFilters.priceRange[1]);
      if (newFilters.stockStatus.inStock) params.set('inStock', 'true');
      if (newFilters.stockStatus.outOfStock) params.set('outOfStock', 'true');

      setSearchParams(params);
    },
    [setSearchParams]
  );

  // Handle search
  const handleSearch = useCallback(
    e => {
      const value = e.target.value;
      setSearchTerm(value);
      setPage(1); // Reset page when search changes

      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // Handle mobile filter toggle
  const toggleMobileFilter = useCallback(() => {
    setIsMobileFilterOpen(prev => !prev);
  }, []);

  // Reset filters on unmount
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('shop_filters');
    };
  }, []);

  // Initialize state from URL params on mount
  useEffect(() => {
    const search = searchParams.get('search') || '';
    setSearchTerm(search);
    setFilters(initialFilters);
  }, [searchParams, initialFilters]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    setSearchParams(
      prev => {
        prev.set('page', value.toString());
        return prev;
      },
      { replace: true }
    );
  };

  // Handle limit change
  const handleLimitChange = newLimit => {
    setLimit(newLimit);
    setPage(1);
    handleClose();
  };

  // Handle close dropdown
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle dropdown click
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchParams(
      prev => {
        prev.delete('categories');
        prev.delete('brands');
        prev.delete('minPrice');
        prev.delete('maxPrice');
        prev.delete('inStock');
        prev.delete('outOfStock');
        prev.set('page', '1');
        setPage(1);
        return prev;
      },
      { replace: true }
    );
    setFilters({
      categories: [],
      brands: [],
      priceRange: [100, 60000],
      stockStatus: {
        inStock: false,
        outOfStock: false,
      },
    });
    setIsMobileFilterOpen(false);
  };

  return (
    <section className='shop-section'>
      <div className='container'>
        <div className='row'>
          {/* Search and Filter Row */}
          <div className='col-12 mb-4'>
            <div className='search-filter-wrapper'>
              <TextField
                className='search-input'
                placeholder='Search products...'
                value={searchTerm}
                onChange={handleSearch}
                variant='outlined'
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <FiSearch className='search-icon' />
                    </InputAdornment>
                  ),
                }}
              />

              <div className='d-md-none'>
                <Button
                  variant='outlined'
                  className='filter-button'
                  onClick={toggleMobileFilter}
                  startIcon={<FiFilter />}
                >
                  Filter
                </Button>
              </div>
            </div>

            {/* Search Results Counter */}
            {(searchTerm ||
              filters.categories.length > 0 ||
              filters.brands.length > 0) && (
              <div className='search-results-counter'>
                <p>
                  {productsData?.total || 0} results found
                  {searchTerm && <span> for "{searchTerm}"</span>}
                  {filters.categories.length > 0 && (
                    <span>
                      {' '}
                      in{' '}
                      {categoriesData?.categories
                        ?.filter(cat => filters.categories.includes(cat._id))
                        .map(cat => cat.name)
                        .join(', ')}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Mobile Filter Drawer */}
          <Drawer
            anchor='bottom'
            open={isMobileFilterOpen}
            onClose={toggleMobileFilter}
            className='mobile-filter-drawer'
          >
            <div className='mobile-filter-header'>
              <h5>Filters</h5>
              <IconButton onClick={toggleMobileFilter}>×</IconButton>
            </div>
            <div className='mobile-filter-content'>
              <Sidebar
                onFilterChange={handleFilterChange}
                initialFilters={initialFilters}
              />
            </div>
          </Drawer>

          {/* Desktop Filters Column */}
          <div className='col-md-3 d-none d-md-block'>
            <div className='filters-wrapper'>
              <Sidebar
                onFilterChange={handleFilterChange}
                initialFilters={initialFilters}
              />
            </div>
          </div>

          {/* Products Grid Column */}
          <div className='col-md-9'>
            <div className='products-wrapper'>
              {isLoading ? (
                <div className='loading-container'>
                  <ThemedSuspense />
                </div>
              ) : productsData?.products?.length > 0 ? (
                <>
                  <div className='products-grid'>
                    {productsData.products.map(product => (
                      <ProductItem
                        key={product._id}
                        product={{
                          ...product,
                          title: searchTerm ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: highlightSearchTerm(
                                  product.title,
                                  searchTerm
                                ),
                              }}
                            />
                          ) : (
                            product.title
                          ),
                          description: searchTerm ? (
                            <span
                              dangerouslySetInnerHTML={{
                                __html: highlightSearchTerm(
                                  product.description,
                                  searchTerm
                                ),
                              }}
                            />
                          ) : (
                            product.description
                          ),
                        }}
                        itemView={view}
                      />
                    ))}
                  </div>

                  {productsData.hasNextPage && (
                    <div className='load-more-container'>
                      <Button
                        variant='outlined'
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={isLoading}
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className='no-products'>
                  <div className='illustration'>
                    <BsInboxes size={120} color='#ccc' />
                  </div>
                  <h3>No Products Found</h3>
                  <p>
                    We couldn't find any products matching your current filters
                    and search criteria.
                  </p>
                  <div className='suggestions'>
                    <h4>Try the following:</h4>
                    <ul>
                      <li>• Check for spelling mistakes in your search</li>
                      <li>• Use more general search terms</li>
                      <li>• Remove some filters to broaden your search</li>
                      <li>• Try different category or brand combinations</li>
                    </ul>
                    {(searchTerm ||
                      filters.categories.length > 0 ||
                      filters.brands.length > 0) && (
                      <Button
                        className='reset-filters-btn'
                        variant='contained'
                        onClick={clearAllFilters}
                      >
                        Reset All Filters
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shop;
