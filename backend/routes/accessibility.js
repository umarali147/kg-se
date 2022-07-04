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
  structured: 0.5,
  contNego: 1,
};
const score = JSON.parse(JSON.stringify(calculatedScore));
router.get("/", async (req, res) => {
  // res.json(await helper.getWifiEntities());
  res.json(getAccessibility());
  // res.json(helper.score(score));
});

const getAccessibility = () => {
  score.availability = calculatedScore.availability;
  score.structured = calculatedScore.structured;
  score.contNego = calculatedScore.contNego;
  return score;
};

module.exports = router;
