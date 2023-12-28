const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDb = require("./config/db");
const colors = require("colors");
const cors = require("cors");
const routes = require("./Routes/index");

const app = express();
app.use(cors());
app.use(express.json());
connectDb();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api", routes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server running on port number: ${port}`.bgBlue.bold);
});
