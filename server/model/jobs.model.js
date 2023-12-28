const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
  {
    title: {
      type: "String",
      required: true,
    },
    tags: [
      {
        type: "Array",
        required: true,
      },
    ],
    product: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
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
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
