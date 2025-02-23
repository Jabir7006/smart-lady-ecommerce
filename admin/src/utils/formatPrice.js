export const formatPrice = (price) => {
  if (!price) return '৳0.00';
  
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}; 