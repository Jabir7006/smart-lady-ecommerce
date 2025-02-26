import { useState, useMemo, useCallback, useEffect } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { FiFilter, FiSearch } from 'react-icons/fi';
import Sidebar from '../../components/Sidebar';
import { CgMenuGridR } from 'react-icons/cg';
import { TfiLayoutGrid4Alt } from 'react-icons/tfi';
import { IoIosMenu } from 'react-icons/io';
import {
  Button,
  Menu,
  MenuItem,
  Pagination,
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
  const [limit, setLimit] = useState(12);

  // Move searchTerm initialization to useEffect
  const [searchTerm, setSearchTerm] = useState('');

  // Move filters initialization to useEffect
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [100, 60000],
    stockStatus: {
      inStock: false,
      outOfStock: false,
    },
  });

  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Initialize filters from URL params
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

  // Reset filters on page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('shop_filters');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Initialize state from URL params
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const categories =
      searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
    const minPrice = Number(searchParams.get('minPrice')) || 100;
    const maxPrice = Number(searchParams.get('maxPrice')) || 60000;
    const inStock = searchParams.get('inStock') === 'true';
    const outOfStock = searchParams.get('outOfStock') === 'true';

    setSearchTerm(search);
    setFilters({
      categories,
      brands,
      priceRange: [minPrice, maxPrice],
      stockStatus: {
        inStock,
        outOfStock,
      },
    });
  }, [searchParams]);

  // Memoize filter parameters
  const filterParams = useMemo(
    () => ({
      page,
      limit,
      search: searchTerm,
      sort: 'createdAt',
      order: 'desc',
      category: filters.categories.join(','),
      brand: filters.brands.join(','),
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
      inStock: filters.stockStatus.inStock,
      outOfStock: filters.stockStatus.outOfStock,
    }),
    [page, limit, searchTerm, filters]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    newFilters => {
      setSearchParams(
        prev => {
          // Update categories
          if (newFilters.categories.length) {
            prev.set('categories', newFilters.categories.join(','));
          } else {
            prev.delete('categories');
          }

          // Update brands
          if (newFilters.brands.length) {
            prev.set('brands', newFilters.brands.join(','));
          } else {
            prev.delete('brands');
          }

          // Update price range
          if (
            newFilters.priceRange[0] !== 100 ||
            newFilters.priceRange[1] !== 60000
          ) {
            prev.set('minPrice', newFilters.priceRange[0].toString());
            prev.set('maxPrice', newFilters.priceRange[1].toString());
          } else {
            prev.delete('minPrice');
            prev.delete('maxPrice');
          }

          // Update stock status
          if (newFilters.stockStatus.inStock) {
            prev.set('inStock', 'true');
          } else {
            prev.delete('inStock');
          }

          if (newFilters.stockStatus.outOfStock) {
            prev.set('outOfStock', 'true');
          } else {
            prev.delete('outOfStock');
          }

          // Reset to page 1 when filters change
          prev.set('page', '1');
          setPage(1);

          return prev;
        },
        { replace: true }
      );

      // Save filters to session storage
      sessionStorage.setItem('shop_filters', JSON.stringify(newFilters));

      // Close mobile filter drawer if open
      setIsMobileFilterOpen(false);
    },
    [setSearchParams]
  );

  const { data: productsData, isLoading } = useProducts(filterParams);

  // Update URL when page changes
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

  const handleLimitChange = newLimit => {
    setLimit(newLimit);
    setPage(1);
    handleClose();
  };

  const openDropdown = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle search input change
  const handleSearchChange = e => {
    const newSearch = e.target.value;
    setSearchTerm(newSearch);

    // Update URL params
    setSearchParams(
      prev => {
        if (newSearch.trim()) {
          prev.set('search', newSearch.trim());
        } else {
          prev.delete('search');
        }
        prev.set('page', '1');
        return prev;
      },
      { replace: true }
    );

    setPage(1);
  };

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
                onChange={handleSearchChange}
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
                  onClick={() => setIsMobileFilterOpen(true)}
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
            onClose={() => setIsMobileFilterOpen(false)}
            className='mobile-filter-drawer'
          >
            <div className='mobile-filter-header'>
              <h5>Filters</h5>
              <IconButton onClick={() => setIsMobileFilterOpen(false)}>
                ×
              </IconButton>
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
