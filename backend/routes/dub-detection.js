const express = require("express");
const router = express.Router();
const urlStatusCode = require("url-status-code");
const weights = require("../weights.json");
const helper = require("../helper.js");
const config = require("../config.json");

const score = {};
router.get("/", async (req, res) => {
  const entities = await helper.getRandomEntitiesQuery(config.totalQuantity);

  //   const gtEntities = await helper.getGTEntities(config.sampleQuantity);
  //   console.log(entities);
  // score.syntactic = await dupDetection(entities);
  let result = await dupDetection(entities);

  res.json(entities);
});
const dupDetection = async (entities) => {
  const entitiesURI = [];
  const entitiesDetailArray = [];
  entities.results.bindings.forEach((element) => {
    entitiesURI.push(element.entity.value);
  });
  for (const element of entitiesURI) {
    const query = `PREFIX schema: <https://schema.org/>
    select ?name where {
      <${element}> schema:name ?name .
    } limit 100`;
    const result = await helper.sparql(query);
    entitiesDetailArray.push(result);
    if (entitiesURI.indexOf(element) === config.totalQuantity - 1) {
      return entitiesDetailArray;
    }
  }

  //   entitiesDetailArray.push({element,})
};

module.exports = router;
