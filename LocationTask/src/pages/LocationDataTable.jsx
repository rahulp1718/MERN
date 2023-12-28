import { useState, useEffect } from "react";
import {
  getLocalStorageData,
  getStoredTags,
  setStoredTags,
} from "../utils/LocalStorage";

const LocationDataTable = ({
  tableData,
  handleDelete,
  handleCheckboxChange,
  handleTagChange,
  handleAddTagToRow,
}) => {
  const [newTag, setNewTag] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    const storedData = getLocalStorageData("locationData");
    tableData.forEach((data) => {
      if (storedData && storedData[data.id] && storedData[data.id].length > 0) {
        handleTagChange(data.id, storedData[data.id]);
      }
    });
  }, [tableData, handleTagChange]);

  const handleAddTag = () => {
    handleAddTagToRow(selectedRows, newTag);

    selectedRows.forEach((rowId) => {
      const storedTags = getStoredTags(rowId);
      const existingTags = storedTags || [];
      const updatedTags = [...existingTags, newTag];
      setStoredTags(rowId, updatedTags);
    });

    setNewTag("");
    setSelectedRows([]);
  };
  const handleCheckboxChangeWithAction = (id) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    });

    handleCheckboxChange(id);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center lg:w-1/2 min-h-screen">
      <div className="mb-4 flex gap-8">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white py-2 px-4 rounded-md mb-4 hover:bg-red-700 transition duration-300"
        >
          Delete
        </button>
        <div>
          <input
            type="text"
            placeholder="Enter new tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="p-2 border mr-2"
          />
          <button
            onClick={handleAddTag}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Add Tag
          </button>
        </div>
      </div>

      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Select</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Location Description</th>
            <th className="p-2 border">Country</th>
            <th className="p-2 border">State</th>
            <th className="p-2 border">City</th>
            <th className="p-2 border">Tags</th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((data) => (
            <tr key={data.id}>
              <td className="p-2 border">
                <input
                  type="checkbox"
                  checked={data.isSelected || false}
                  onChange={() => handleCheckboxChangeWithAction(data.id)}
                />
              </td>
              <td className="p-2 border">{data.location}</td>
              <td className="p-2 border">{data.locationDescription}</td>
              <td className="p-2 border">{data.country}</td>
              <td className="p-2 border">{data.state}</td>
              <td className="p-2 border">{data.city}</td>
              <td className="p-2 border">
                {data.tags && data.tags.length > 0 && (
                  <div>{data.tags.map((tag) => tag.value).join(", ")}</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LocationDataTable;
