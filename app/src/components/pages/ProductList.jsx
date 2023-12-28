import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../constant";
import { useNavigate } from "react-router-dom";
import { InvoiceState } from "../../context/InvoiceProvider";

const ProductList = () => {
  const { products, setSelectedProduct, getAllProducts } = InvoiceState();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllProducts();
      } catch (error) {
        console.error("Error fetching products:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getAllProducts]);

  const handleDelete = async (id) => {
    try {
      if (!id) {
        console.error("Invalid product ID");
        return;
      }

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      await axios.delete(`${url}/product/${id}`, config);
      getAllProducts();
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    navigate("/products", { state: { product } });
  };

  useEffect(() => {
    setProductData(products);
  }, [products]);

  const productNames = productData.map((product) => product.name);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-bold text-3xl text-blue-600 my-5">Products List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="flex flex-col justify-center">
          <li className="flex justify-between gap-5 mb-3 font-bold text-xl bg-blue-600 p-2 rounded-sm text-white">
            <span className="w-32 text-center">Name</span>
            <span className="w-72 text-center">Description</span>
            <span className="w-32 text-center">Price</span>
            <span className="w-32 text-center">Delete</span>
            <span className="w-32 text-center">Update</span>
          </li>
          {productData.map((product) => (
            <li
              key={product._id}
              className="flex justify-between gap-5 mb-3 bg-gray-200 p-2 rounded-sm"
            >
              <span className="w-32">{product.name}</span>
              <span className="w-72">{product.descryption}</span>
              <span className="w-32">{product.price}</span>
              <span className="w-32">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </span>
              <span className="w-32">
                <button
                  className="bg-blue-600 text-white px-2 py-1 rounded"
                  onClick={() => handleUpdate(product)}
                >
                  Update
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
