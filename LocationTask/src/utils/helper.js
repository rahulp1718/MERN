export const arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    obj[item[keyField]] = item;
    return obj;
  }, {});

export const filterByCountry = (array, selectedCountry) =>
  array.filter((item) => item.country === selectedCountry);

export const filterByState = (array, selectedState) =>
  array.filter((item) => item.state === selectedState);
