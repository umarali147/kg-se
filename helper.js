const axios = require("axios");
const querystring = require("querystring");
const baseUrl = "http://localhost:7200/repositories/wifipois";
const poiDSURL =
  "https://semantify.it/api/v2/domainSpecifications/dsv7/sloejGAwT?populate=true";
let poiDS;
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

const getPoiDS = async () => {
  poiDS = await axios.get(poiDSURL);
  return poiDS.data;
};

module.exports = { score, sparql, getPoiDS };
