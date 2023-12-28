const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: "String",
      required: true,
    },
    descryption: {
      type: "String",
      required: true,
    },
    price: {
      type: "Number",
      required: true,
    },
    isDeleted: {
      type: "Boolean",
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
