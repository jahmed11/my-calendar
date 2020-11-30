require("dotenv/config");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const userRouter = require("./routes/user-routes");
const eventRouter = require("./routes/event-routes");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res, next) => {
  res.send("server is running");
});

app.use("/user", userRouter);
app.use("/event", eventRouter);

mongoose
  .connect(
    "mongodb+srv://junaid-ahmed147:passsword@cluster0.gfsh1.mongodb.net/calendar?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("connected to server and mongoose");
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
