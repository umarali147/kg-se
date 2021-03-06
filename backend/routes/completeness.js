const express = require("express");
const router = express.Router();
const weights = require("../weights.json");
const helper = require("../helper.js");
const config = require("../config.json");
let wifiUrl = `${config.graphDBURL}/repositories/${config.wifiRepo}`;

const score = {};
router.get("/", async (req, res) => {
  res.json(await getCompleteness());
});
const getCompleteness = async () => {
  const sampleQuery = helper.getRandomEntitiesQuery(config.sampleQuantity);
  const entities = await helper.sparql(sampleQuery, wifiUrl);
  score.instance = (await getInstanceCompScore(entities)).toFixed(3);
  score.domain = (await getDomainCompScore()).toFixed(3);
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
    PREFIX schema: <https://schema.org/>
    SELECT ?p ?o
    WHERE {
        {<${element}> ?p ?o.}
        FILTER ((?o != "") ) 
    }
    `;
    const result = await helper.sparql(query, wifiUrl);
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
  PREFIX schema: <https://schema.org/>
  SELECT (count(?s) as ?p)
  WHERE {
    ?s a schema:Place.
  }
  `;
  const result = await helper.sparql(query, wifiUrl);
  const totalEntities = Object.keys(await helper.rest(config.apiURL)).length;
  const numOfEntities = result.results.bindings[0].p.value;
  return numOfEntities / totalEntities;
};
module.exports = router;
