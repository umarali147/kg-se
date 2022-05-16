const express = require("express");
const app = express();
const axios = require("axios");

app.use(express.json());

// routes
const accessibility = require("./routes/accessibility");
const correctness = require("./routes/correctness");
const completeness = require("./routes/completeness");
const insert = require("./routes/insert");

app.get("/", (req, res) => {
  res.json(data);
  res.send("complete result");
});

app.use("/accessibility", accessibility);
app.use("/correctness", correctness);
app.use("/completeness", completeness);
app.use("/insert", insert);

app.listen(3000);
