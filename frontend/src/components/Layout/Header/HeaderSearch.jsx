import { Button } from '@mui/material';
import { IoIosSearch } from 'react-icons/io';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchDropdown from './SearchDropdown';

const HeaderSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsDropdownVisible(false);
    }
  };

  const handleProductSelect = product => {
    navigate(`/product/${product._id}`);
    setIsDropdownVisible(false);
    setSearchTerm('');
  };

  return (
    <div ref={searchRef} className='headerSearch ml-3 mr-3'>
      <form onSubmit={handleSearch}>
        <input
          type='text'
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setIsDropdownVisible(true);
          }}
          onFocus={() => setIsDropdownVisible(true)}
          placeholder='Search for products...'
          aria-label='Search products'
        />
        <Button type='submit'>
          <IoIosSearch />
        </Button>
      </form>

      {isDropdownVisible && searchTerm.trim() && (
        <SearchDropdown
          searchTerm={searchTerm}
          onSelect={handleProductSelect}
        />
      )}
    </div>
  );
};

export default HeaderSearch;
