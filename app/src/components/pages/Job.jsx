import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { tags, url } from "../../constant";
import { useNavigate, useLocation } from "react-router-dom";
import { InvoiceState } from "../../context/InvoiceProvider";
import axios from "axios";

const Job = () => {
  const { products } = InvoiceState();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const isUpdateMode = location.state && location.state.job;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (isUpdateMode) {
      const { job } = location.state;
      setValue("title", job.title);
      setValue("notes", job.notes);

      const tagsData = Array.isArray(job.selectedTags)
        ? job.selectedTags.flat().map((tag) => ({ value: tag, label: tag }))
        : [];
      setSelectedTags(tagsData);

      const productsData = Array.isArray(job.selectedProducts)
        ? job.selectedProducts
            .flat()
            .map((productId) =>
              products.find((product) => product._id === productId)
            )
        : [];
      setSelectedProducts(productsData);
    }
  }, [isUpdateMode, location.state, products, setValue]);

  const calculateSubTotal = () => {
    return selectedProducts?.reduce(
      (total, product) => total + product.price,
      0
    );
  };

  const calculateTotal = (subTotal, taxRate) => {
    const tax = (subTotal * taxRate) / 100;
    return subTotal + tax;
  };

  const handleProductSelect = (selectedOptions) => {
    setSelectedProducts(selectedOptions);
  };

  const handleTagsSelect = (selectedOptions) => {
    setSelectedTags(selectedOptions);
  };

  const onSubmit = async (data) => {
    try {
      data.tax = 7;
      const jobData = {
        ...data,
        selectedProducts: selectedProducts.map((product) => product._id),
        selectedTags: selectedTags.map((tag) => tag.value),
        subTotal: calculateSubTotal(),
        total: calculateTotal(calculateSubTotal(), data.tax),
      };

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      if (isUpdateMode) {
        await axios.patch(
          `${url}/job/updateJob/${location.state.job._id}`,
          jobData,
          config
        );
      } else {
        await axios.post(`${url}/job`, jobData, config);
      }
      reset();
      navigate("/");
    } catch (error) {
      console.log("Error creating/updating job:", error.message);
    }
  };

  return (
    <div className="w-full h-[93vh] py-5 px-2 shadow-2xl flex justify-center items-center flex-col">
      <h1 className="text-blue-600 font-bold text-[30px] mx-auto my-5 ">
        {isUpdateMode ? "Update Job" : "Create Job"}
      </h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            placeholder="Title"
            className="border-2 border-gray-600 p-2 rounded"
            {...register("title", {
              required: "Title is required",
              maxLength: 20,
            })}
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="notes">Notes:</label>
          <input
            type="text"
            id="notes"
            placeholder="Notes"
            className="border-2 border-gray-600 p-2 rounded"
            {...register("notes", {
              required: "Notes are required",
              maxLength: 100,
            })}
          />
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="tags">Tags:</label>
          <Select
            isMulti
            id="tags"
            placeholder="Select tags"
            options={tags.map((tag) => ({ value: tag, label: tag }))}
            value={selectedTags}
            onChange={handleTagsSelect}
          />
          {errors.selectedTags && (
            <p className="text-red-500">{errors.selectedTags.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="products">Products:</label>
          <Select
            isMulti
            id="products"
            placeholder="Select products"
            options={products.map((product) => ({
              _id: product._id,
              value: product.name,
              label: `${product.name} - $${product.price}`,
              price: product.price,
            }))}
            value={selectedProducts}
            onChange={handleProductSelect}
          />
          {errors.selectedProducts && (
            <p className="text-red-500">{errors.selectedProducts.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="subTotal">SubTotal:</label>
          <input
            type="number"
            id="subTotal"
            placeholder="SubTotal"
            className="border-2 border-gray-600 bg-gray-300 p-2 rounded"
            value={calculateSubTotal()}
            readOnly
            {...register("subTotal", {
              required: "SubTotal is required",
              maxLength: 100,
            })}
          />
          {errors.subTotal && (
            <p className="text-red-500">{errors.subTotal.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="total">Total:</label>
          <input
            type="number"
            id="total"
            placeholder="Total"
            className="border-2 border-gray-600 bg-gray-300 p-2 rounded"
            value={calculateTotal(calculateSubTotal(), 7)}
            readOnly
          />
        </div>
        <button
          className="bg-blue-600 text-white font-bold px-4 py-2 rounded"
          type="submit"
        >
          {isUpdateMode ? "Update Job" : "Add Job"}
        </button>
      </form>
    </div>
  );
};

export default Job;
