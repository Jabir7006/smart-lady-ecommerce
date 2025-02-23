import { useProducts } from '../../../hooks/useProducts';
import { useDebounce } from 'use-debounce';
import HighlightedText from '../../ui/HighlightedText';

const SearchDropdown = ({ searchTerm, onSelect }) => {
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  const { data, isLoading } = useProducts({
    search: debouncedSearch,
    limit: 5,
    page: 1,
  });

  if (!searchTerm.trim() || !data?.products?.length) return null;

  return (
    <div className='search-dropdown'>
      {data.products.map(product => (
        <div
          key={product._id}
          className='search-dropdown-item'
          onClick={() => onSelect(product)}
        >
          <img
            src={product.images[0]?.url}
            alt={product.title}
            className='search-dropdown-image'
          />
          <div className='search-dropdown-content'>
            <h4>
              <HighlightedText text={product.title} highlight={searchTerm} />
            </h4>
            <p className='price'>${product.regularPrice}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchDropdown;
