const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Assessment");
});

app.listen(3000);
