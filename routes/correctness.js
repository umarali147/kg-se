const express = require("express");
const router = express.Router();
const weights = require("../weights.json").accessibility;
const helper = require("../helper.js");

const score = {};
router.get("/", async (req, res) => {
  score.syntactic = await getSyntacticScore();
  // score.semantic = getSemanticScore() * weights.semantic;
  // console.log(helper(score));

  // res.json(score.syntactic);
});
async function getSyntacticScore() {
  const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>
SELECT ?entity ?type
WHERE {
  ?entity rdf:type schema:Place.
}
`;
  const result = await helper.sparql(query);
  calculateSyntacticScore(result);
}
function getSemanticScore() {}
async function calculateSyntacticScore(result) {
  const ds = await helper.getPoiDS();
  console.log(ds["@graph"][0]["sh:property"]);
}

module.exports = router;
