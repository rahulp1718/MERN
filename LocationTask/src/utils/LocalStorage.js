export const getStoredTags = () => {
  const storedTags = JSON.parse(localStorage.getItem("locationTags")) || [];
  return storedTags;
};

export const setStoredTags = (tags) => {
  localStorage.setItem("locationTags", JSON.stringify(tags));
};

export const updateLocalStorage = (data) => {
  localStorage.setItem("locationData", JSON.stringify(data));
};

export const getLocalStorageData = (key) => {
  const storedData = JSON.parse(localStorage.getItem(key));
  return storedData || [];
};
