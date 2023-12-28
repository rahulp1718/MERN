const Product = require("../model/product.model");
const {
  ERROR_CREATING,
  INTERNAL_SERVER_ERROR,
  ERROR_GETTING,
  UPDATED_SUCCESS,
  DELETE_SUCCESS,
  NOT_FOUND,
  ERROR_DELETING,
} = require("../constant");

exports.createNewProduct = async (req, res) => {
  const { name, descryption, price } = req.body;
  try {
    const newProduct = await Product.create({ name, descryption, price });
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error(ERROR_CREATING, error.message);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false });

    res.status(200).json(products);
  } catch (error) {
    console.error(ERROR_GETTING, error.message);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, descryption, price } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, descryption, price },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: NOT_FOUND });
    }
    return res.json({ message: UPDATED_SUCCESS, data: updatedProduct });
  } catch (error) {
    console.error(ERROR_UPDATE, error.message);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findById(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: NOT_FOUND });
    }
    deletedProduct.isDeleted = true;
    await deletedProduct.save();
    return res.json({ message: DELETE_SUCCESS, data: deletedProduct });
  } catch (error) {
    console.error(ERROR_DELETING, error.message);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};
