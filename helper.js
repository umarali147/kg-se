const axios = require("axios");
const querystring = require("querystring");
const config = require("./config.json");
const baseUrl = `${config.graphDBURL}/repositories/wifipois`;

// calculate final score
const score = (obj) => {
  let finalScore = 0;
  for (const [key, value] of Object.entries(obj)) {
    finalScore += value;
  }
  return (finalScore /= Object.keys(obj).length);
};
// sparql endpoint for each query
const sparql = async (query) => {
  try {
    const result = await axios.post(
      baseUrl,
      querystring.stringify({
        query: query,
      }),
      {
        headers: {
          Accept:
            "application/x-sparqlstar-results+json, application/sparql-results+json",
          "Content-Type": "application/x-www-form-urlencoded;",
        },
      }
    );
    return result.data;
  } catch (err) {
    console.log("error");
  }
};

const rest = async (url) => {
  let poiDS = await axios.get(url);
  return poiDS.data;
};

const getRandomEntities = (limit) => {
  const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX schema: <http://schema.org/>
  SELECT ?entity ?type
  WHERE {
    ?entity rdf:type schema:Place.
  }
  ORDER BY RAND() LIMIT ${limit}`;

  return sparql(query);
};

module.exports = { score, sparql, rest, getRandomEntities };
