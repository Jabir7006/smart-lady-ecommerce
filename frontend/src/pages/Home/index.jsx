import { IoIosArrowRoundForward } from 'react-icons/io';
import HomeBanner from '../../components/Home/HomeBanner';
import { Button } from '@mui/material';
import ProductItem from '../../components/Products/ProductItem/ProductItem';
import HomeCat from '../../components/Home/HomeCat';
import NewsLetter from '../../components/Home/NewsLetter';
import ProductSlider from '../../components/ui/ProductSlider';
import GlobalContext from '../../context/GlobalContext';
import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useProducts, useFeaturedProducts } from '../../hooks/useProducts';
import ThemedSuspense from '../../components/ThemedSuspense';
import ScrollableTabs from '../../components/Home/ScrollableTabs';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { setisHeaderFooterVisible } = useContext(GlobalContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  // if (!isAuthenticated) {
  //   return <div>Please login to continue</div>
  // }

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [100, 60000],
    stockStatus: {
      inStock: false,
      outOfStock: false,
    },
  });

  // Initialize filters from URL params in useEffect
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
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
    }));
  }, [searchParams]);

  const { data: featuredProducts, isLoading: featuredLoading } =
    useFeaturedProducts();
  const { data: newProducts, isLoading: productsLoading } = useProducts({
    page,
    limit: 9,
    sort: 'createdAt',
    order: 'desc',
    category: filters.categories.join(','),
    brand: filters.brands.join(','),
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
    inStock: filters.stockStatus.inStock,
    outOfStock: filters.stockStatus.outOfStock,
  });

  const handleFilterChange = useCallback(
    newFilters => {
      setFilters(prev => {
        const updated = { ...prev, ...newFilters };
        const params = new URLSearchParams(searchParams);

        // Only handle categories and brands, ignore price range unless explicitly changed
        if (updated.categories.length) {
          params.set('categories', updated.categories.join(','));
        } else {
          params.delete('categories');
        }

        if (updated.brands.length) {
          params.set('brands', updated.brands.join(','));
        } else {
          params.delete('brands');
        }

        // Only set price range if it's explicitly different from default
        if (
          newFilters.priceRange &&
          (newFilters.priceRange[0] !== 100 ||
            newFilters.priceRange[1] !== 60000)
        ) {
          params.set('minPrice', newFilters.priceRange[0]);
          params.set('maxPrice', newFilters.priceRange[1]);
        }

        if (updated.stockStatus.inStock) {
          params.set('inStock', 'true');
        } else {
          params.delete('inStock');
        }

        if (updated.stockStatus.outOfStock) {
          params.set('outOfStock', 'true');
        } else {
          params.delete('outOfStock');
        }

        setSearchParams(params, { replace: true });
        return updated;
      });
      setPage(1);
    },
    [searchParams, setSearchParams]
  );

  const handleCategoryChange = useCallback(
    categoryId => {
      handleFilterChange({ categories: categoryId ? [categoryId] : [] });
    },
    [handleFilterChange]
  );

  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm || !text) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight-match">$1</span>');
  };

  return (
    <>
      <HomeBanner />
      <HomeCat />

      <section className='homeProducts pb-0'>
        <div className='container'>
          <div className='row homeProductsRow'>
            <div className='col-md-3'>
              <div className='sticky'>
                <div className='banner mb-3'>
                  <img
                    src='https://api.spicezgold.com/download/file_1734525757507_NewProject(34).jpg'
                    alt='product'
                    className='cursor-pointer w-100 transition'
                  />
                </div>
                <div className='banner mb-3'>
                  <img
                    src='https://api.spicezgold.com/download/file_1734525767798_NewProject(35).jpg'
                    alt='product'
                    className='cursor-pointer w-100 transition'
                  />
                </div>
              </div>
            </div>

            <div className='col-md-9 productRow'>
              {featuredLoading ? (
                <div
                  style={{
                    minHeight: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ThemedSuspense />
                </div>
              ) : (
                featuredProducts?.products && (
                  <ProductSlider
                    title='FEATURED PRODUCTS'
                    description='Do not miss the current offers until the end'
                    itemView={4}
                    products={featuredProducts.products}
                  />
                )
              )}

              <div className='d-flex align-items-center mt-4'>
                <div className='info' style={{ width: '35%' }}>
                  <h3 className='mb-0 hd'>NEW ARRIVALS</h3>
                  <p className='text-light text-sm mb-0'>
                    New Products With updated stocks.
                  </p>
                </div>
                <div className='ml-auto'>
                  <ScrollableTabs onCategoryChange={handleCategoryChange} />
                </div>
              </div>

              <div
                className='product_row productRow2 w-100 mt-4 d-flex flex-wrap'
                style={{ minHeight: '200px', position: 'relative' }}
              >
                {productsLoading ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <ThemedSuspense />
                  </div>
                ) : newProducts?.products?.length > 0 ? (
                  newProducts.products.map(product => (
                    <ProductItem
                      key={product._id}
                      product={{
                        ...product,
                        title: searchParams.get('search') ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightSearchTerm(
                                product.title,
                                searchParams.get('search')
                              ),
                            }}
                          />
                        ) : (
                          product.title
                        ),
                        description: searchParams.get('search') ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightSearchTerm(
                                product.description,
                                searchParams.get('search')
                              ),
                            }}
                          />
                        ) : (
                          product.description
                        ),
                      }}
                    />
                  ))
                ) : (
                  <div className='text-center w-100 py-5'>
                    <p>No products found in this category.</p>
                  </div>
                )}
              </div>

              {newProducts?.hasNextPage && (
                <div className='text-center mt-4'>
                  <Button
                    variant='outlined'
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={productsLoading}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <NewsLetter />
    </>
  );
};

export default Home;
