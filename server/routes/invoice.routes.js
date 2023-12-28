const express = require("express");
const route = express.Router();
const {
  createNewInvoice,
  getAllInvoice,
} = require("../controller/invoice.controller.js");

route.get("/", getAllInvoice);
route.post("/", createNewInvoice);

module.exports = route;
