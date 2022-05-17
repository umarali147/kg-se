const express = require("express");
const router = express.Router();
const weights = require("../weights.json").accessibility;
const helper = require("../helper.js");
const config = require("../config.json");

const score = {};
router.get("/", async (req, res) => {
  const entities = await helper.getRandomEntities(config.sampleQuantity);
  score.syntactic = await getSyntacticScore(entities);

  // score.syntactic = await getSyntacticScore();
  // score.semantic = getSemanticScore() * weights.semantic;
  // console.log(helper(score));
  res.json(score);
  // res.json(score.syntactic);
});
const getSyntacticScore = async (entities) => {
  const entitiesURI = [];
  entities.results.bindings.forEach((element) => {
    entitiesURI.push(element.entity.value);
  });
  let finalScore = 0;
  for (const element of entitiesURI) {
    const query = `PREFIX schema: <http://schema.org/>
  select * where { 
    <${element}> ?p ?o .
      {bind(datatype(?o) as ?dt) }
      union
      {?o ?p2 ?o2.
      bind(datatype(?o2) as ?dtt) }
  } limit 100`;

    const result = await helper.sparql(query);
    const dsResult = await helper.rest(config.poiDSURL);

    finalScore += await calculateSyntacticScore(
      result.results.bindings,
      dsResult["@graph"][0]["sh:property"]
    );
    if (entitiesURI.indexOf(element) === config.sampleQuantity - 1) {
      finalScore /= config.sampleQuantity;
      return finalScore > 1 ? 1 : finalScore;
    }
  }
};
const calculateSyntacticScore = async (res, dsProperties) => {
  let score = 0;
  res.forEach((element) => {
    if (element.p2) {
      // ++
    } else {
      // console.log(element);
      if (element?.o?.type === "bnode") return;
      let value = element?.p?.value.replace("http://schema.org/", "schema:");
      dsProperties.forEach((prop) => {
        if (prop["sh:path"] === value) {
          // console.log(element);
          let dsDataType = prop["sh:or"][0]["sh:datatype"].split(":").pop();
          let resDataType = element?.dt?.value.split("#").pop();

          if (dsDataType === "anyURI") {
            if (element.o.value.startsWith("https")) {
              score++;
            }
          } else {
            if (dsDataType === resDataType) {
              score++;
            }
          }
        }
      });
    }
  });
  console.log(score);
  return score / 6;
};

const getSemanticScore = () => {};
module.exports = router;
