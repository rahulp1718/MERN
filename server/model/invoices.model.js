const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema(
  {
    title: {
      type: "String",
      required: true,
    },
    products: {
      type: "Array",
      required: true,
    },
    tags: {
      type: "Array",
      required: true,
    },
    notes: {
      type: "String",
      required: true,
    },
    isDeleted: {
      type: "Boolean",
      default: false,
    },
    tax: {
      type: "Number",
      required: true,
    },
    subTotal: {
      type: "Number",
      required: true,
    },
    total: {
      type: "Number",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
