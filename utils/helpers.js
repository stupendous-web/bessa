export const formatDistance = (value) => {
  let unit = "ft";
  value = value * 3.28084; // Convert meters to feet
  if (value >= 5280) {
    unit = "mi";
    value = value / 5280;
  }
  value =
    unit === "ft" ? parseFloat(value).toFixed() : parseFloat(value).toFixed(2);

  return `${value} ${unit}`;
};

export const groupBy = (data, property) => {
  return data.reduce((accumulator, object) => {
    const key = object[property];
    const curGroup = accumulator[key] ?? [];

    return { ...accumulator, [key]: [...curGroup, object] };
  }, {});
};
