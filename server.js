const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.json());

const authRoutes = require("./routers/auth");

app.use("/auth", authRoutes);

app.use((err, req, res, next) => {
  const error = err.message || "some internal error occured.!";
  const statusCode = err.statusCode;
  res.status(statusCode).json({
    error: error,
  });
});

mongoose
  .connect(process.env.MONGO_DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((connect) => {
    app.listen(process.env.PORT);
    console.log("SERVER RUNNING AND DB CONNECTED.");
  })
  .catch((err) => {
    console.log(err);
  });
