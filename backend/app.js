const express = require("express");
const app = express();
const helper = require("./helper");

app.use(express.json());
app.use(express.static("./frontend"));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
});
// routes
const accessibility = require("./routes/accessibility");
const correctness = require("./routes/correctness");
const completeness = require("./routes/completeness");
const dupDetection = require("./routes/dub-detection");
const nearby = require("./routes/nearby");
const insert = require("./routes/insert");
const constraints = require("./routes/constraints");

app.get("/assessment", (req, res) => {});

app.use("/accessibility", accessibility);
app.use("/correctness", correctness);
app.use("/completeness", completeness);
// app.use("/duplicate", dupDetection);
app.use("/nearby", nearby);
app.use("/insert", insert);
app.use("/error-detection", constraints);
app.listen(3000);
