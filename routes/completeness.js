const express = require("express");
const router = express.Router();
const weights = require("../weights.json");
const helper = require("../helper.js");
const config = require("../config.json");

const score = {};
router.get("/", async (req, res) => {
  res.json(await getCompleteness());
});
const getCompleteness = async () => {
  const entities = await helper.getRandomEntities(config.sampleQuantity);
  score.instance =
    (await getInstanceCompScore(entities)) * weights.completeness.instance;
  score.domain = (await getDomainCompScore()) * weights.completeness.domain;
  return score;
  // return(helper.score(score));
};
const getInstanceCompScore = async (entities) => {
  const dsResult = await helper.rest(config.poiDSURL);
  const entitiesURI = [];
  entities.results.bindings.forEach((element) => {
    entitiesURI.push(element.entity.value);
  });
  let finalScore = 0;
  for (const element of entitiesURI) {
    const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX schema: <http://schema.org/>
    SELECT ?p ?o
    WHERE {
        {<${element}> ?p ?o.}
        FILTER ((?o != "") ) 
    }
    `;
    const result = await helper.sparql(query);
    finalScore += await calculateInstanceScore(
      result.results.bindings,
      dsResult["@graph"][0]["sh:property"]
    );
    if (entitiesURI.indexOf(element) === config.sampleQuantity - 1) {
      finalScore /= config.sampleQuantity;
      return finalScore > 1 ? 1 : finalScore;
    }
  }
};
const calculateInstanceScore = async (res, dsProperties) => {
  return (res.length - 1) / dsProperties.length;
};

const getDomainCompScore = async () => {
  const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX schema: <http://schema.org/>
  SELECT (count(?s) as ?p)
  WHERE {
    ?s a schema:Place.
  }
  `;
  const result = await helper.sparql(query);
  const totalEntities = Object.keys(await helper.rest(config.apiURL)).length;
  const numOfEntities = result.results.bindings[0].p.value;
  return numOfEntities / totalEntities;
};
module.exports = router;
