const generateShortDescription = (description, maxLength = 500) => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + '...';
};

export default generateShortDescription;
