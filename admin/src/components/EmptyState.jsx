import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@windmill/react-ui';

const EmptyState = ({ 
  title = 'No data found', 
  message = 'No items to display right now.', 
  actionLink, 
  actionText 
}) => {
  return (
    <div className="text-center py-12">
      <div className="text-gray-600 dark:text-gray-400 mb-8">
        <svg 
          className="w-16 h-16 mx-auto mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
          />
        </svg>
        <h3 className="text-xl font-medium mb-1">{title}</h3>
        <p className="text-sm">{message}</p>
      </div>
      
      {actionLink && actionText && (
        <Link to={actionLink}>
          <Button>
            {actionText}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyState; 