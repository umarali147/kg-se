const axios = require("axios");
const querystring = require("querystring");
const config = require("./config.json");
let wifiUrl = `${config.graphDBURL}/repositories/${config.wifiRepo}`;
let gtUrl = `${config.graphDBURL}/repositories/${config.germanTourismRepo}`;

// calculate final score
const score = (obj) => {
  let finalScore = 0;
  for (const [key, value] of Object.entries(obj)) {
    finalScore += value;
  }
  return (finalScore /= Object.keys(obj).length);
};
// sparql endpoint for each query
const sparql = async (query, url) => {
  try {
    const result = await axios.post(
      url,
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
    console.log("err");
  }
};

const rest = async (url) => {
  let poiDS = await axios.get(url);
  return poiDS.data;
};

const getRandomEntitiesQuery = (limit) => {
  const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX schema: <https://schema.org/>
  SELECT ?entity ?type
  WHERE {
    ?entity rdf:type schema:Place.
  }
  limit ${limit}`;
  return query;
};
const getWifiEntities = (limit) => {
  const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX schema: <https://schema.org/>
  SELECT ?entity ?type
  WHERE {
    ?entity rdf:type schema:Place.
  }
  `;
  return sparql(query, wifiUrl);
};
const getGTEntities = (limit) => {
  const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX schema: <https://schema.org/>
  SELECT ?entity ?type
  WHERE {
    ?entity rdf:type schema:Place.
  } LIMIT ${limit}`;
  return sparql(query, true);
};

const getWifiEntitiesWithGeo = (limit) => {
  const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX schema: <https://schema.org/>
  SELECT ?entity ?lat ?long
  WHERE {
    ?entity rdf:type schema:Place;
   				 schema:geo ?geo.
    ?geo schema:latitude ?lat;
     	schema:longitude ?long.
  }
  `;
  return query;
};

const updateSparql = async (query, url) => {
  url = url + "/statements";

  try {
    const result = await axios.post(
      url,
      querystring.stringify({
        update: query,
      }),
      {
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return result.data;
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  score,
  sparql,
  rest,
  getRandomEntitiesQuery,
  getGTEntities,
  getWifiEntities,
  getWifiEntitiesWithGeo,
  updateSparql,
};
