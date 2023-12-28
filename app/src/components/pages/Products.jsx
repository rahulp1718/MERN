import { useForm } from "react-hook-form";
import axios from "axios";
import { url } from "../../constant";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const Product = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const isUpdate = location.state && location.state.product;

  useEffect(() => {
    if (isUpdate) {
      setValue("name", location.state.product.name);
      setValue("descryption", location.state.product.descryption);
      setValue("price", location.state.product.price);
    }
  }, [isUpdate, location.state, setValue]);

  const onSubmit = async (data) => {
    try {
      if (!data) return console.log("Error while submitting form data");

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      if (isUpdate) {
        console.log(location.state.product._id);
        await axios.patch(
          `${url}/product/updateProduct/${location.state.product._id}`,
          data,
          config
        );
      } else {
        await axios.post(`${url}/product`, data, config);
      }
      reset();
      navigate("/productList");
    } catch (error) {
      console.log("Error Message", error.message);
    }
  };

  return (
    <div className="w-full h-[92vh] py-5 px-2  shadow-2xl sha flex justify-center items-center flex-col">
      <h1 className="text-blue-600 text-[30px] mx-auto font-bold my-5">
        {isUpdate ? "Update Product" : "Add Product"}
      </h1>
      <form className="flex flex-col gap-4  " onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          className="border-2 border-gray-600 p-2 rounded"
          {...register("name", { required: "Name is required", maxLength: 30 })}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <label htmlFor="descryption">Description:</label>
        <input
          type="text"
          id="descryption"
          className="border-2 border-gray-600 p-2 rounded"
          {...register("descryption", {
            required: "Description is required",
            maxLength: 100,
          })}
        />
        {errors.descryption && (
          <p className="text-red-500">{errors.descryption.message}</p>
        )}

        <label htmlFor="price">Price:</label>
        <input
          type="text"
          id="price"
          className="border-2 border-gray-600 p-2 rounded"
          {...register("price", {
            required: "Price is required",
            maxLength: 8,
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Invalid price format",
            },
          })}
        />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}

        <button
          className="bg-blue-600 text-white font-bold px-4 py-2 rounded"
          type="submit"
        >
          {isUpdate ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default Product;
