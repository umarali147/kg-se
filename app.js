const express = require("express");
const app = express();

// routes
const accessibility = require("./routes/accessibility");
const correctness = require("./routes/correctness");
const completeness = require("./routes/completeness");

app.get("/", (req, res) => {
  res.send("complete result");
});

app.get("/accessibility", (req, res) => {
  res.send("Accessibility");
});
app.get("/correctness", (req, res) => {
  res.send("Correctness");
});
app.get("/completeness", (req, res) => {
  res.send("Completeness");
});

app.listen(3000);
