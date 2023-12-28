import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { url } from "../constant";

const InvoiceContext = createContext();

const InvoiceProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${url}/product`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  const getAllJobs = async () => {
    try {
      const response = await axios.get(`${url}/job`);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error.message);
    }
  };

  useEffect(() => {
    getAllProducts();
    getAllJobs();
  }, []);

  return (
    <InvoiceContext.Provider
      value={{
        jobs,
        setJobs,
        products,
        setProducts,
        invoice,
        setInvoice,
        selectedProduct,
        setSelectedProduct,
        getAllProducts,
        getAllJobs,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const InvoiceState = () => {
  return useContext(InvoiceContext);
};

export default InvoiceProvider;
