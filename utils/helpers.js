export const formatDistance = (value) => {
  value = value * 0.000621371; // Convert meters to miles
  value = parseFloat(value).toFixed(2);
  return `${value} miles`;
};
