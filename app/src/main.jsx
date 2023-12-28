import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import InvoiceProvider from "./context/InvoiceProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <InvoiceProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </InvoiceProvider>
);
