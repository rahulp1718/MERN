import { useState, useEffect } from "react";
import Select from "react-select";
import { mockCountries, mockStates, mockCities, tags } from "../mockData";
import { filterByCountry, filterByState } from "../utils/helper";

const LocationForm = ({ onSubmit }) => {
  const initialFormState = {
    location: "",
    locationDescription: "",
    selectedCountry: "",
    selectedState: "",
    selectedCity: "",
    selectedTags: [],
  };

  const [formState, setFormState] = useState(initialFormState);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [tagNames, setTagNames] = useState(tags);
  const [errors, setErrors] = useState({
    location: "",
    locationDescription: "",
    selectedCountry: "",
    selectedState: "",
    selectedCity: "",
    selectedTags: "",
  });

  useEffect(() => {
    setCountries(mockCountries);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
    clearError(name);
  };

  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setFormState((prevState) => ({ ...prevState, selectedCountry: countryId }));
    setStates(filterByCountry(mockStates, countryId));
    clearError("selectedCountry");
  };

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setFormState((prevState) => ({ ...prevState, selectedState: stateId }));
    setCities(filterByState(mockCities, stateId));
    clearError("selectedState");
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setFormState((prevState) => ({ ...prevState, selectedCity: cityId }));
    clearError("selectedCity");
  };

  const handleTagsChange = (selectedTags) => {
    setFormState((prevState) => ({ ...prevState, selectedTags }));
    clearError("selectedTags");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formState);
    setFormState(initialFormState);
    clearError();
  };

  const validateForm = () => {
    const requiredFields = [
      "location",
      "locationDescription",
      "selectedCountry",
      "selectedState",
      "selectedCity",
    ];
    const validationErrors = {};

    requiredFields.forEach((field) => {
      if (!formState[field].trim()) {
        validationErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } field cannot be empty`;
      }
    });

    if (formState.selectedTags.length === 0) {
      validationErrors.selectedTags = "Please select at least one tag";
    }

    return Object.keys(validationErrors).length ? validationErrors : null;
  };

  const clearError = (fieldName) => {
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
  };

  return (
    <div className="w-full flex items-center justify-center lg:w-1/2 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center w-full md:w-10/12 lg:w-3/5 shadow-2xl p-5 bg-white"
      >
        <h1 className="text-3xl mx-auto mb-5 font-medium">Location Form</h1>
        <div className="flex flex-col mb-3">
          <label className="mb-1 text-md font-medium">Location:</label>
          <input
            type="text"
            name="location"
            value={formState.location}
            onChange={handleInputChange}
            className={`border rounded-md p-2 ${
              errors.location ? "border-red-500" : ""
            }`}
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}
        </div>

        <div className="flex flex-col mb-3">
          <label className="mb-1 text-md font-medium">
            Location Description:
          </label>
          <input
            type="text"
            name="locationDescription"
            value={formState.locationDescription}
            onChange={handleInputChange}
            className={`border rounded-md p-2 ${
              errors.locationDescription ? "border-red-500" : ""
            }`}
          />
          {errors.locationDescription && (
            <p className="text-red-500 text-sm">{errors.locationDescription}</p>
          )}
        </div>

        <div className="flex flex-col mb-3">
          <label className="mb-1 text-md font-medium">Country:</label>
          <select
            name="selectedCountry"
            value={formState.selectedCountry}
            onChange={handleCountryChange}
            className={`border rounded-md p-2 ${
              errors.selectedCountry ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Country</option>
            {countries.map(({ id, name }) => (
              <option key={id} value={name}>
                {name}
              </option>
            ))}
          </select>
          {errors.selectedCountry && (
            <p className="text-red-500 text-sm">{errors.selectedCountry}</p>
          )}
        </div>

        <div className="flex flex-col mb-3">
          <label className="mb-1 text-md font-medium">State:</label>
          <select
            name="selectedState"
            value={formState.selectedState}
            onChange={handleStateChange}
            disabled={!formState.selectedCountry}
            className={`border rounded-md p-2 ${
              errors.selectedState ? "border-red-500" : ""
            }`}
          >
            <option value="">Select State</option>
            {states.map(({ id, name }) => (
              <option key={id} value={name}>
                {name}
              </option>
            ))}
          </select>
          {errors.selectedState && (
            <p className="text-red-500 text-sm">{errors.selectedState}</p>
          )}
        </div>

        <div className="flex flex-col mb-3">
          <label className="mb-1 text-md font-medium">City:</label>
          <select
            name="selectedCity"
            value={formState.selectedCity}
            onChange={handleCityChange}
            disabled={!formState.selectedState}
            className={`border rounded-md p-2 ${
              errors.selectedCity ? "border-red-500" : ""
            }`}
          >
            <option value="">Select City</option>
            {cities.map(({ id, name }) => (
              <option key={id} value={name}>
                {name}
              </option>
            ))}
          </select>
          {errors.selectedCity && (
            <p className="text-red-500 text-sm">{errors.selectedCity}</p>
          )}
        </div>

        <div className="flex flex-col mb-3">
          <label className="mb-1 text-md font-medium">Tags:</label>
          <Select
            isMulti
            options={tagNames}
            value={formState.selectedTags}
            onChange={handleTagsChange}
          />
          {errors.selectedTags && (
            <p className="text-red-500 text-sm">{errors.selectedTags}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LocationForm;
