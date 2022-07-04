const express = require("express");
const router = express.Router();
const urlStatusCode = require("url-status-code");
const weights = require("../weights.json");
const helper = require("../helper.js");
const config = require("../config.json");
let wifiUrl = `${config.graphDBURL}/repositories/${config.wifiRepo}`;

const score = {};
router.get("/", async (req, res) => {
  res.json(await getCorrectness());
});
const getCorrectness = async () => {
  const sampleQuery = helper.getRandomEntitiesQuery(config.sampleQuantity);

  const entities = await helper.sparql(sampleQuery, wifiUrl);
  score.syntactic = (await getSyntacticScore(entities)).toFixed(3);

  score.semantic = (await getSemanticScore(entities)).toFixed(3);
  return score;
};
const getSyntacticScore = async (entities) => {
  const entitiesURI = [];
  entities.results.bindings.forEach((element) => {
    entitiesURI.push(element.entity.value);
  });
  let finalScore = 0;
  for (const element of entitiesURI) {
    const query = `PREFIX schema: <https://schema.org/>
  select * where { 
    <${element}> ?p ?o .
      {bind(datatype(?o) as ?dt) }
      union
      {?o ?p2 ?o2.
      bind(datatype(?o2) as ?dtt) }
  } limit 100`;

    const result = await helper.sparql(query, wifiUrl);

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
      if (element?.o?.type === "bnode") return;
      let value = element?.p?.value.replace("https://schema.org/", "schema:");
      dsProperties.forEach((prop) => {
        if (prop["sh:path"] === value) {
          let dsDataType = prop["sh:or"][0]["sh:datatype"].split(":").pop();
          let resDataType = element?.dt?.value.split("#").pop();

          if (dsDataType === "anyURI") {
            if (element.o.value.startsWith("http")) {
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
  return score / 6;
};

const getSemanticScore = async (entities) => {
  const entitiesURI = [];
  entities.results.bindings.forEach((element) => {
    entitiesURI.push(element.entity.value);
  });
  let finalScore = 0;
  for (const element of entitiesURI) {
    const query = `PREFIX schema: <https://schema.org/>
  select * where { 
    <${element}> ?p ?o .
      {bind(datatype(?o) as ?dt) }
      union
      {?o ?p2 ?o2.
      bind(datatype(?o2) as ?dtt) }
  } limit 100`;

    const result = await helper.sparql(query, wifiUrl);

    finalScore += await calculateSemanticScore(result.results.bindings);
    if (entitiesURI.indexOf(element) === config.sampleQuantity - 1) {
      finalScore /= config.sampleQuantity;
      return finalScore > 1 ? 1 : finalScore;
    }
  }
};
const calculateSemanticScore = async (res) => {
  let score = 0;
  const lat = res.find((ele) => {
    return ele?.p2?.value === "https://schema.org/latitude";
  });
  const lon = res.find((ele) => {
    return ele?.p2?.value === "https://schema.org/longitude";
  });
  res.forEach(async (element) => {
    if (element.p2) {
      const entityURI = element.p2.value;
      const entityValue = element.o2.value;
      if (
        (entityURI == "https://schema.org/addressCountry" &&
          entityValue == "DE") ||
        entityValue == "de"
      ) {
        score += 0.25;
      } else if (
        entityURI == "https://schema.org/addressLocality" &&
        entityValue !== ""
      ) {
        score += 0.25;
      } else if (
        entityURI == "https://schema.org/postalCode" &&
        entityValue !== ""
      ) {
        score += 0.25;
      } else if (
        entityURI == "https://schema.org/streetAddress" &&
        entityValue !== ""
      ) {
        score += 0.25;
      } else if (entityURI == "https://schema.org/latitude") {
        const geoURL = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat.o2.value}&lon=${lon.o2.value}&apiKey=${config.geoapifyKey}`;

        try {
          const result = await helper.rest(geoURL);

          if (result.statusCode === 400) return;
          if (
            result.features[0].properties.country_code === "de" ||
            result.features[0].properties.country_code === "DE"
          ) {
            score = score + 1;
          }
        } catch (err) {}
      }
    } else {
      if (element?.o?.type === "bnode") return;
      let resDataType = element?.dt?.value.split("#").pop();
      const entityURI = element.p.value;
      const entityValue = element.o.value;
      if (entityURI === "https://schema.org/url") {
        if (entityValue.startsWith("http")) {
          const statusCode = await urlStatusCode(entityValue);
          if (statusCode === 200) score++;
        }
      }
      if (entityURI === "https://schema.org/telephone") {
        if (isRegexCorrect("telephone", entityValue)) score++;
      } else if (resDataType !== "") {
        score++;
      }
    }
  });
  return score / 8;
};

const isRegexCorrect = (type, value) => {
  if (type == "telephone") {
    const regex = new RegExp(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    );
    const result = value.match(regex);
    if (result == null) {
      return false;
    }
    if (result.length === 1 && result[0].length === value.length) {
      return true;
    }
    return false;
  }
};
module.exports = router;
