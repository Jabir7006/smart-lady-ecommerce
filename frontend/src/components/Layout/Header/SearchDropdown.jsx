import { useProducts } from '../../../hooks/useProducts';
import { CircularProgress, Typography, Box, Divider } from '@mui/material';
import { IoSearchOutline } from 'react-icons/io5';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { memo } from 'react';

const HighlightedText = memo(({ text, highlight }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className='highlight-match'>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
});

const SearchDropdown = memo(({ searchTerm, onSelect }) => {
  const { data, isLoading } = useProducts({
    search: searchTerm,
    limit: 5,
    page: 1,
  });

  if (!searchTerm.trim()) return null;

  return (
    <div className='search-dropdown'>
      {isLoading ? (
        <Box
          className='search-loading'
          display='flex'
          alignItems='center'
          justifyContent='center'
          gap={1}
        >
          <CircularProgress size={20} color='secondary' />
          <Typography variant='body2'>Searching...</Typography>
        </Box>
      ) : !data?.products?.length ? (
        <Box
          className='search-no-results'
          display='flex'
          alignItems='center'
          justifyContent='center'
          gap={1}
        >
          <IoSearchOutline size={18} />
          <Typography variant='body2'>
            No products found for "{searchTerm}"
          </Typography>
        </Box>
      ) : (
        <>
          <Box px={1} py={0.5}>
            <Typography variant='caption' color='text.secondary'>
              {data.totalProducts > 5
                ? `Showing 5 of ${data.totalProducts} results`
                : `${data.totalProducts} results found`}
            </Typography>
          </Box>
          <Divider />
          {data.products.map(product => (
            <div
              key={product._id}
              className='search-dropdown-item'
              onClick={() => onSelect(product)}
            >
              <div className='search-dropdown-image-container'>
                {product.images && product.images[0]?.url ? (
                  <img
                    src={product.images[0]?.url}
                    alt=''
                    className='search-dropdown-image'
                    loading='lazy'
                  />
                ) : (
                  <MdOutlineProductionQuantityLimits size={20} color='#999' />
                )}
              </div>
              <div className='search-dropdown-content'>
                <h4>
                  <HighlightedText
                    text={product.title}
                    highlight={searchTerm}
                  />
                </h4>
                <p className='price'>${product.regularPrice.toFixed(2)}</p>
              </div>
            </div>
          ))}
          <Divider />
          <Box
            className='search-view-all'
            onClick={() => onSelect({ _id: 'search', title: searchTerm })}
            py={1}
            textAlign='center'
            sx={{
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
            }}
          >
            <Typography variant='body2' color='primary'>
              View all results
            </Typography>
          </Box>
        </>
      )}
    </div>
  );
});

export default SearchDropdown;
