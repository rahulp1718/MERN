import Home from "./components/pages/Home";
import Job from "./components/pages/Job";
import ProductList from "./components/pages/ProductList";
import Products from "./components/pages/Products";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import InvoiceList from "./components/pages/InvoiceList";

const App = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="productList" element={<ProductList />} />
            <Route path="job" element={<Job />} />
            <Route path="invoiceList" element={<InvoiceList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
