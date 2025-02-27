const generateShortDescription = (description, maxLength = 100) => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + '...';
};

export default generateShortDescription;
