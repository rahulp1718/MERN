const express = require("express");
const productRoutes = require("./product.routes");
const jobRoutes = require("./job.routes");
const invoiceRoutes = require("./invoice.routes");
const router = express.Router();

router.use("/product", productRoutes);
router.use("/job", jobRoutes);
router.use("/invoice", invoiceRoutes);

module.exports = router;
