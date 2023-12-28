const express = require("express");
const route = express.Router();
const {
  getAllProducts,
  createNewProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/product.controller.js");

route.get("/", getAllProducts);
route.post("/", createNewProduct);
route.patch("/updateProduct/:id", updateProduct);
route.delete("/:id", deleteProduct);

module.exports = route;
