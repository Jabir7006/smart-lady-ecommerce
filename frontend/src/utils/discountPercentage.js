const calculateDiscountPercentage = (regularPrice, discountPrice) => {
    if (!regularPrice || !discountPrice) return 0;
    const discount = regularPrice - discountPrice;
    return Math.round((discount / regularPrice) * 100);
  };

  export default calculateDiscountPercentage;