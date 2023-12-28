import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../constant";
import { InvoiceState } from "../../context/InvoiceProvider";

const InvoiceList = () => {
  const { products } = InvoiceState();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${url}/invoice`);
      setInvoices(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching invoices:", error.message);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-bold text-3xl my-5 text-blue-600">Invoice List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="flex flex-col justify-center">
          <li className="flex justify-between gap-5 mb-4 bg-blue-600 p-2 rounded-sm text-white">
            <span className="w-32 font-bold text-xl text-center">Title</span>
            <span className="w-48 font-bold text-xl text-center">Notes</span>
            <span className="w-48 font-bold text-xl text-center">Tags</span>
            <span className="w-48 font-bold text-xl text-center">Products</span>
            <span className="w-32 font-bold text-xl text-center">Tax</span>
            <span className="w-48 font-bold text-xl text-center">SubTotal</span>
            <span className="w-32 font-bold text-xl text-center">Total</span>
          </li>
          {Array.isArray(invoices) &&
            invoices.map((invoice) => (
              <li
                key={invoice._id}
                className="flex justify-between gap-5 mb-3 bg-gray-200 p-2 rounded-sm"
              >
                <span className="w-32 text-center">{invoice.title}</span>
                <span className="w-48 text-center">{invoice.notes}</span>
                <span className="w-48 text-center">
                  {invoice.tags.join(", ")}
                </span>
                <span className="w-48 text-center">
                  {invoice.products?.map((productId, index) => {
                    const product = products.find((p) => p._id == productId);
                    return (
                      <React.Fragment key={index}>
                        {index > 0 && ", "}
                        {product?.name}
                      </React.Fragment>
                    );
                  })}
                </span>
                <span className="w-32 text-center">{invoice.tax}%</span>
                <span className="w-48 text-center">{invoice.subTotal}</span>
                <span className="w-32 text-center">{invoice.total}</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default InvoiceList;
