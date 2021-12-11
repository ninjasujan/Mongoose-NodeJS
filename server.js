const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routers/auth");
app.use("/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", async function () {
  console.log(`[Mongodb database connected]`);
});

mongoose.connection.on("error", (error) => {
  console.log("Eror in db connection", error);
});

app.use((err, req, res, next) => {
  console.log(err);
  const message = err.message;
  const status = err.status | 500;
  res.status(status).json({
    status: "Error",
    message,
  });
});

app.listen(process.env.PORT, () => {
  console.log("SERVER RUNNING.", process.env.PORT);
});
