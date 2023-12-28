const {
  DELETE_SUCCESS,
  UPDATED_SUCCESS,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../constant");
const Job = require("../model/jobs.model");

const handleErrorResponse = (error, res) => {
  console.error(INTERNAL_SERVER_ERROR, error.message);
  return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
};

exports.createNewJob = async (req, res) => {
  const { title, notes, tax, subTotal, total, selectedProducts, selectedTags } =
    req.body;
  const product = selectedProducts?.map((product) => product._id);
  const tags = selectedTags?.map((tag) => tag.value);

  try {
    const newJob = await Job.create({
      title,
      product,
      tags,
      notes,
      tax,
      subTotal,
      total,
    });
    return res.status(201).json(newJob);
  } catch (error) {
    handleErrorResponse(error, res);
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isDeleted: false });
    res.status(200).json(jobs);
  } catch (error) {
    handleErrorResponse(error, res);
  }
};

exports.updateJob = async (req, res) => {
  try {
    const { title, notes, tax, subTotal, total, product } = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { title, notes, tax, subTotal, total, product },
      { new: true }
    );
    if (!updatedJob) {
      return res.status(404).json({ message: NOT_FOUND });
    }
    return res.json({ message: UPDATED_SUCCESS, data: updatedJob });
  } catch (error) {
    handleErrorResponse(error, res);
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findById(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({ message: NOT_FOUND });
    }
    deletedJob.isDeleted = true;
    await deletedJob.save();
    return res.json({ message: DELETE_SUCCESS, data: deletedJob });
  } catch (error) {
    handleErrorResponse(error, res);
  }
};
