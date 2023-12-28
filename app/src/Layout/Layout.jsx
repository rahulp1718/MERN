import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav className="w-full bg-blue-600 text-white text-lg py-2 mb-1">
        <ul className="flex gap-5 font-bold ml-5">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/job">Job</Link>
          </li>
          <li>
            <Link to="/products">Product</Link>
          </li>
          <li>
            <Link to="/productList">ProductList</Link>
          </li>
          <li>
            <Link to="/invoiceList">InvoiceList</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
};

export default Layout;
