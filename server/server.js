const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const server = express();
const connectDb = require("./database/db");
const router = require("./routes/index");
const port = process.env.PORT;

connectDb();
server.use(express.json());
server.use(cors());
server.use("/api", router);

server.listen(port, () => {
  console.log(`server listining on port ${port}`);
});
