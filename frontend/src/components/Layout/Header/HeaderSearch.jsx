import {
  Button,
  InputAdornment,
  TextField,
  ClickAwayListener,
} from '@mui/material';
import { IoIosSearch } from 'react-icons/io';
import SearchDropdown from './SearchDropdown';
import useSearch from '../../../hooks/useSearch';

const HeaderSearch = () => {
  const {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    isDropdownVisible,
    handleSearch,
    handleProductSelect,
    handleClickAway,
  } = useSearch();

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className='headerSearch'>
        <form onSubmit={handleSearch} className='search-form'>
          <TextField
            fullWidth
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.trim()}
            placeholder='Search'
            aria-label='Search products'
            variant='outlined'
            size='small'
            className='search-input'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <Button
                    type='submit'
                    className='search-button'
                    size='small'
                    aria-label='search'
                  >
                    <IoIosSearch style={{ fontSize: '16px' }} />
                  </Button>
                </InputAdornment>
              ),
              sx: {
                borderRadius: '4px',
                padding: '0 4px 0 8px',
                '&.MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#7e57c2',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7e57c2',
                  },
                },
              },
            }}
          />
        </form>

        {isDropdownVisible && debouncedSearchTerm.trim() && (
          <SearchDropdown
            searchTerm={debouncedSearchTerm}
            onSelect={handleProductSelect}
          />
        )}
      </div>
    </ClickAwayListener>
  );
};

export default HeaderSearch;
