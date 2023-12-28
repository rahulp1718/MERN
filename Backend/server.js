const express = require("express");
const cors = require("cors");
const connectDb = require("./database");
const colors = require("colors");

const routes = require("./Routes/TodoRoutes");
require("dotenv").config();
connectDb();

const server = express();
const port = process.env.PORT || 5000;

server.use(express.json());
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(routes);

server.listen(port, () => {
  console.log(`Server running at port number ${port}`.bgBlue.bold);
});

module.exports = server;
