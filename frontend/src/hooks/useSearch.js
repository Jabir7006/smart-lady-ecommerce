import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { useProducts } from './useProducts';

/**
 * Custom hook for search functionality
 * @param {Object} options - Configuration options
 * @param {number} options.debounceTime - Debounce time in milliseconds
 * @param {number} options.limit - Number of results to fetch
 * @param {boolean} options.autoNavigate - Whether to navigate to search results page on selection
 * @returns {Object} Search state and handlers
 */
export const useSearch = ({
  debounceTime = 300,
  limit = 5,
  autoNavigate = true,
} = {}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm, debounceTime);
  const navigate = useNavigate();

  // Fetch search results
  const { data, isLoading } = useProducts({
    search: debouncedSearchTerm,
    limit,
    page: 1,
  });

  // Show dropdown when typing and there's content
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      setIsDropdownVisible(true);
    }
  }, [debouncedSearchTerm]);

  // Handle search submission
  const handleSearch = useCallback(
    e => {
      if (e) e.preventDefault();

      if (searchTerm.trim()) {
        navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
        setIsDropdownVisible(false);
        setSearchTerm('');
      }
    },
    [searchTerm, navigate]
  );

  // Handle product selection
  const handleProductSelect = useCallback(
    product => {
      if (product._id === 'search') {
        // "View all results" was clicked
        navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      } else if (autoNavigate) {
        navigate(`/product/${product._id}`);
      }

      setIsDropdownVisible(false);
      setSearchTerm('');
    },
    [searchTerm, navigate, autoNavigate]
  );

  // Handle click away
  const handleClickAway = useCallback(() => {
    setIsDropdownVisible(false);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    isDropdownVisible,
    setIsDropdownVisible,
    handleSearch,
    handleProductSelect,
    handleClickAway,
    results: data?.products || [],
    totalResults: data?.totalProducts || 0,
    isLoading,
  };
};

export default useSearch;
