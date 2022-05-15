const express = require("express");
const router = express.Router();
const weights = require("../weights.json").accessibility;
const helper = require("../helper.js");

router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});
const calculatedScore = {
  availability: 1,
  structured: 1,
  contNego: 1,
};
const score = JSON.parse(JSON.stringify(calculatedScore));
router.get("/", (req, res) => {
  score.availability = calculatedScore.availability * weights.availability;
  score.structured = calculatedScore.structured * weights.structured;
  score.contNego = calculatedScore.contNego * weights.contNego;
  // console.log(score.length);
  console.log(helper(score));

  // res.json(forObject.entries(score));
});

module.exports = router;
