const Invoice = require("../model/invoices.model");

exports.createNewInvoice = async (req, res) => {
  const { _id, title, product, notes, tax, subTotal, total, tags } = req.body;

  try {
    const newInvoice = await Invoice.create({
      title: title,
      products: product,
      tags: tags,
      notes: notes,
      tax: tax,
      subTotal: subTotal,
      total: total,
      jobId: _id,
    });
    return res.status(200).json(newInvoice);
  } catch (error) {
    return res.status(500).json({
      message: ERROR_CREATING,
      error: error.message,
    });
  }
};

exports.getAllInvoice = async (req, res) => {
  try {
    const invoices = await Invoice.find({ isDeleted: false });

    res.status(200).json(invoices);
  } catch (error) {
    return res.status(500).json({
      message: ERROR_GETTING,
      error: error.message,
    });
  }
};
