const express = require("express");
const app = express();
const axios = require("axios");

// routes
const accessibility = require("./routes/accessibility");
const correctness = require("./routes/correctness");
const completeness = require("./routes/completeness");

app.get("/", (req, res) => {
  res.send("complete result");
});

app.post("/insert", (req, res) => {});

app.use("/accessibility", accessibility);
app.get("/correctness", correctness);
app.get("/completeness", completeness);

app.listen(3000);
