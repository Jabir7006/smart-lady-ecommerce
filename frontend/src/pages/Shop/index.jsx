import { useState, useMemo, useCallback, useEffect } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import { CgMenuGridR } from 'react-icons/cg';
import { TfiLayoutGrid4Alt } from 'react-icons/tfi';
import { IoIosMenu } from 'react-icons/io';
import { Button, Menu, MenuItem, Pagination } from '@mui/material';
import ProductItem from '../../components/Products/ProductItem/ProductItem';
import { useProducts } from '../../hooks/useProducts';
import ThemedSuspense from '../../components/ThemedSuspense';
import { useSearchParams } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';

const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || !text) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<span class="highlight-match">$1</span>');
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [view, setView] = useState('four');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [limit, setLimit] = useState(10);

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

  // Update URL when filters change
  const handleFilterChange = useCallback(
    newFilters => {
      setFilters(prev => {
        const updated = { ...prev, ...newFilters };
        const params = new URLSearchParams(searchParams);

        if (searchTerm) {
          params.set('search', searchTerm);
        }

        if (updated.categories.length) {
          params.set('categories', updated.categories.join(','));
          const categoryNames = categoriesData?.categories
            ?.filter(cat => updated.categories.includes(cat._id))
            .map(cat => cat.slug || cat.name)
            .join(',');
          if (categoryNames) params.set('category_names', categoryNames);
        } else {
          params.delete('categories');
          params.delete('category_names');
        }

        if (updated.brands.length) {
          params.set('brands', updated.brands.join(','));
          const brandNames = brandsData?.brands
            ?.filter(brand => updated.brands.includes(brand._id))
            .map(brand => brand.slug || brand.title)
            .join(',');
          if (brandNames) params.set('brand_names', brandNames);
        } else {
          params.delete('brands');
          params.delete('brand_names');
        }

        // Only set price range params if they differ from defaults
        if (updated.priceRange[0] !== 100 || updated.priceRange[1] !== 60000) {
          params.set('minPrice', updated.priceRange[0]);
          params.set('maxPrice', updated.priceRange[1]);
        } else {
          params.delete('minPrice');
          params.delete('maxPrice');
        }

        if (updated.stockStatus.inStock) params.set('inStock', 'true');
        else params.delete('inStock');

        if (updated.stockStatus.outOfStock) params.set('outOfStock', 'true');
        else params.delete('outOfStock');

        setSearchParams(params, { replace: true });
        return updated;
      });
      setPage(1);
    },
    [searchParams, setSearchParams, categoriesData, brandsData, searchTerm]
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

  return (
    <>
      <section className='product_Listing_Page'>
        <div className='container'>
          <div className='productListing d-flex'>
            <Sidebar onFilterChange={handleFilterChange} />
            <div className='content_right'>
              <div className='search-container mb-3'>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Real-time Search products...'
                  value={searchTerm}
                  onChange={e => {
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
                  }}
                />
              </div>

              {searchTerm && (
                <div className='search-results-header mb-3'>
                  <h2 className='h5 mb-0'>
                    Search results for "{searchTerm}"
                    {productsData?.total !== undefined && (
                      <span className='text-muted ml-2'>
                        ({productsData.total} products found)
                      </span>
                    )}
                  </h2>
                </div>
              )}

              <div className='showBy mt-3 mb-3 d-flex align-items-center'>
                <div className='d-flex align-items-center btnWrapper'>
                  <Button
                    className={view === 'one' && 'active'}
                    onClick={() => setView('one')}
                  >
                    <IoIosMenu />
                  </Button>
                  <Button
                    className={view === 'three' && 'active'}
                    onClick={() => setView('three')}
                  >
                    <CgMenuGridR />
                  </Button>
                  <Button
                    className={view === 'four' && 'active'}
                    onClick={() => setView('four')}
                  >
                    <TfiLayoutGrid4Alt />
                  </Button>
                </div>

                <div className='ml-auto showByFilter'>
                  <Button onClick={handleClick}>
                    Show {limit} <FaAngleDown />
                  </Button>

                  <Menu
                    className='w-100 showPerPageDropdown'
                    anchorEl={anchorEl}
                    open={openDropdown}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => handleLimitChange(10)}>
                      10
                    </MenuItem>
                    <MenuItem onClick={() => handleLimitChange(20)}>
                      20
                    </MenuItem>
                    <MenuItem onClick={() => handleLimitChange(30)}>
                      30
                    </MenuItem>
                    <MenuItem onClick={() => handleLimitChange(40)}>
                      40
                    </MenuItem>
                    <MenuItem onClick={() => handleLimitChange(50)}>
                      50
                    </MenuItem>
                  </Menu>
                </div>
              </div>

              <div className='productListing'>
                {isLoading ? (
                  <ThemedSuspense />
                ) : productsData?.products?.length > 0 ? (
                  productsData.products.map(product => (
                    <ProductItem
                      key={product._id}
                      product={{
                        ...product,
                        title: searchTerm 
                          ? <span dangerouslySetInnerHTML={{ 
                              __html: highlightSearchTerm(product.title, searchTerm) 
                            }} />
                          : product.title,
                        description: searchTerm 
                          ? <span dangerouslySetInnerHTML={{ 
                              __html: highlightSearchTerm(product.description, searchTerm) 
                            }} />
                          : product.description
                      }}
                      itemView={view}
                    />
                  ))
                ) : (
                  <div className='text-center w-100 py-5'>
                    <p>No products found.</p>
                  </div>
                )}
              </div>

              {productsData?.total > 0 && (
                <div className='d-flex align-items-center justify-content-center mt-5'>
                  <Pagination
                    count={Math.ceil(productsData?.total / limit)}
                    page={page}
                    onChange={handlePageChange}
                    color='primary'
                    size='large'
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Shop;
