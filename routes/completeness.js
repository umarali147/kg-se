const express = require("express");
const router = express.Router();
const weights = require("../weights.json").accessibility;
const helper = require("../helper.js");

const score = {};
router.get("/", async (req, res) => {
  const entities = await helper.getRandomEntities(10);
  await getInstanceCompletenessScore();
  // score.syntactic = await getInstanceCompletenessScore();
  // score.semantic = getSemanticScore() * weights.semantic;
  // console.log(helper(score));

  // res.json(score.syntactic);
});
const getInstanceCompletenessScore = async () => {};

module.exports = router;
