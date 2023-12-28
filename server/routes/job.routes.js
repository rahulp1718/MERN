const express = require("express");
const route = express.Router();
const {
  getAllJobs,
  createNewJob,
  updateJob,
  deleteJob,
} = require("../controller/jobs.controller.js");

route.get("/", getAllJobs);
route.post("/", createNewJob);
route.patch("/updateJob/:id", updateJob);
route.delete("/:id", deleteJob);

module.exports = route;
