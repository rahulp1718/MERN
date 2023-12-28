import { useState, useEffect } from "react";
import { mockCities, mockCountries, mockStates, tags } from "../mockData";
import LocationForm from "./LocationForm";
import LocationDataTable from "./LocationDataTable";
import { updateLocalStorage, getLocalStorageData } from "../utils/LocalStorage";

const LocationData = () => {
  const initialFormState = {
    selectedCountry: "",
    selectedState: "",
    selectedCity: "",
    location: "",
    locationDescription: "",
    selectedTags: [],
  };

  const [formState, setFormState] = useState(initialFormState);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const storedData = getLocalStorageData("locationData");
    setTableData(storedData);
    const lastSelectedTag = storedData
      .filter((data) => data.selectedTag)
      .map((data) => data.selectedTag);

    if (lastSelectedTag.length > 0) {
      setFormState((prevFormState) => ({
        ...prevFormState,
        selectedTags: lastSelectedTag,
      }));
    }

    storedData.forEach((data) => {
      const storedTags = getLocalStorageData(data.id);
      if (storedTags && storedTags.length > 0) {
        handleTagChange(data.id, storedTags);
      }
    });

    setTableData((prevData) =>
      prevData.map((data) => ({ ...data, isSelected: false }))
    );
  }, []);

  useEffect(() => {}, [tableData]);

  const handleFormSubmit = (formData) => {
    const {
      selectedCountry,
      selectedState,
      selectedCity,
      location,
      locationDescription,
      selectedTags,
    } = formData;

    const country = mockCountries.find(
      (country) => country.name === selectedCountry
    );
    const state = mockStates.find((state) => state.name === selectedState);
    const city = mockCities.find((city) => city.name === selectedCity);

    const newData = {
      id: Date.now(),
      location,
      locationDescription,
      country: country?.name || "",
      state: state?.name || "",
      city: city?.name || "",
      tags: selectedTags || ["Home"],
      selectedTag: selectedTags[0] || "",
    };

    const storedData = getLocalStorageData("locationData") || [];
    localStorage.setItem(
      "locationData",
      JSON.stringify([...storedData, newData])
    );

    setTableData((prevData) => [...prevData, newData]);
    setFormState(initialFormState);
  };

  const handleTagChange = (id, selectedTags) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      selectedTags,
    }));

    setTableData((prevData) =>
      prevData.map((data) =>
        data.id === id
          ? { ...data, tags: selectedTags, selectedTag: selectedTags[0] || "" }
          : data
      )
    );
  };

  const handleAddTagToRow = (selectedRowIds, newTag) => {
    const updatedData = tableData.map((data) =>
      selectedRowIds.includes(data.id)
        ? {
            ...data,
            tags: [...data.tags, { id: Date.now(), value: newTag }],
          }
        : data
    );

    setTableData(updatedData);
    updateLocalStorage(updatedData);
  };

  const handleDelete = () => {
    const updatedData = tableData.filter((data) => !data.isSelected);
    setTableData(updatedData);
    localStorage.setItem("locationData", JSON.stringify(updatedData));
    setTableData(updatedData);
  };

  const handleCheckboxChange = (id) => {
    setTableData((prevData) =>
      prevData.map((data) =>
        data.id === id ? { ...data, isSelected: !data.isSelected } : data
      )
    );
  };

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <LocationForm onSubmit={handleFormSubmit} initialFormState={formState} />
      <LocationDataTable
        tableData={tableData}
        handleDelete={handleDelete}
        handleCheckboxChange={handleCheckboxChange}
        handleAddTagToRow={handleAddTagToRow}
        handleTagChange={handleTagChange}
        tags={tags}
      />
    </div>
  );
};

export default LocationData;
