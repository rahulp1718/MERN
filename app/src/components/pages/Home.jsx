import React, { useEffect, useState } from "react";
import axios from "axios";
import { InvoiceState } from "../../context/InvoiceProvider";
import { url } from "../../constant";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { getAllJobs, jobs, products, setJobs } = InvoiceState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllJobs();
    setLoading(false);
  }, [getAllJobs]);

  const handleDelete = async (id) => {
    try {
      if (!id) return console.log("error while submitting form data");
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      await axios.delete(`${url}/job/${id}`, config);

      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
    } catch (error) {
      console.log("error.message", error.message);
    }
  };

  const createInvoice = async (jobId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const invoiceData = jobs.find((job) => job._id === jobId);
      await axios.post(`${url}/invoice`, invoiceData, config);
      navigate("/invoiceList");
    } catch (error) {
      console.log("Error creating invoice:", error.message);
    }
  };

  const handleUpdate = (job) => {
    navigate("/job", { state: { job } });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="font-bold text-3xl my-5 text-blue-600">Job List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="flex flex-col justify-center">
          <li className="flex justify-between gap-5 mb-4 bg-blue-600 p-2 rounded-sm text-white">
            <span className="w-32 font-bold text-xl text-center">Title</span>
            <span className="w-48 font-bold text-xl text-center">Notes</span>
            <span className="w-48 font-bold text-xl text-center">Tags</span>
            <span className="w-48 font-bold text-xl text-center">Products</span>
            {/* <span className="w-32 font-bold text-xl text-center">Tax</span> */}
            <span className="w-32 font-bold text-xl text-center">SubTotal</span>
            <span className="w-32 font-bold text-xl text-center">Total</span>
            {/* <span className="w-32 font-bold text-xl text-center">Update</span>
            <span className="w-32 font-bold text-xl text-center">Delete</span>
            <span className="w-32 font-bold text-xl text-center">Invoice</span> */}
            <span className="w-72 font-bold text-xl text-center">Actions</span>
          </li>
          {Array.isArray(jobs) &&
            jobs.map((job) => (
              <li
                key={job._id}
                className="flex justify-between gap-5 mb-3 bg-gray-200 p-2 rounded-sm"
              >
                <span className="w-32 text-center">{job.title}</span>
                <span className="w-48 text-center">{job.notes}</span>
                <span className="w-48 text-center">{job.tags.join(", ")}</span>
                <span className="w-48 text-center">
                  {job.product?.map((productId, index) => {
                    const product = products.find((p) => p._id === productId);
                    return (
                      <React.Fragment key={productId}>
                        {index > 0 && ", "}
                        {product?.name}
                      </React.Fragment>
                    );
                  })}
                </span>
                {/* <span className="w-32 text-center">{job.tax}%</span> */}
                <span className="w-32 text-center">{job.subTotal}</span>
                <span className="w-32 text-center">{job.total}</span>
                <div className="flex gap-3">
                  <span className="content-center">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => handleUpdate(job)}
                    >
                      Update
                    </button>
                  </span>
                  <span className=" content-center">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(job._id)}
                    >
                      Delete
                    </button>
                  </span>
                  <span className=" mx-auto">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        createInvoice(job._id);
                      }}
                    >
                      Create Invoice
                    </button>
                  </span>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
