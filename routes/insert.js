const SparqlClient = require("sparql-http-client");
const express = require("express");
const router = express.Router();
const data = require("../data.json");
const request = require("request");
const axios = require("axios");

const endpointUrl = "http://localhost:7200/repositories/wifi-poi/statements";
const updateUrl = endpointUrl;

const client = new SparqlClient({ endpointUrl, updateUrl });
router.post("/", async (req, res) => {
  const wifi = req.body;
  const names = Object.keys(wifi);
  let name,
    url,
    address,
    geo,
    isAccessibleForFree,
    publicAccess,
    email,
    focus,
    location;
  for (let index = 0; index < names.length; index++) {
    name = wifi[names[index]].name;
    url = wifi[names[index]].url;
    // location = wifi[names[index]].location;
    location.city = "isloo";
    location.postal_code = "6020";
    email = wifi[names[index]].contact.email;
    let focusArr = wifi[names[index]].state.focus;

    isAccessibleForFree =
      focusArr.includes("Public Free Wifi") ||
      focusArr.includes("Free internet access");
    publicAccess = isAccessibleForFree;
    const lastChange = wifi[names[index]].state.lastchange;
  }

  let annotation;
  // insertCookieQuery = `PREFIX schema: <https://www.schema.org/>
  //       INSERT DATA {
  //             <https://www.schema.org/${name}> a <http://www.semanticweb.org/OntoCookie#Wifi>;
  //              schema:url "${url}";
  //              schema:name "${name}";
  //              schema:address "${location}";
  //              schema:focus "${focus}";
  //              schema:email "${email}".
  //             }
  //       `;

  annotation = await save(endpointUrl, insertCookieQuery);

  // insertDataInKnowledgeGraph(insertCookieQuery);

  res.json("Data has been inserted successfully");
});

async function save(endpointUrl, insertCookieQuery) {
  return new Promise(function (resolve, reject) {
    request(
      {
        url: endpointUrl,
        headers: {
          Accept: "application/ld+json",
          "Content-Type": "application/ld+json",
        },
        method: "POST",
        body: insertCookieQuery,
      },
      (err, res) => {
        if (err) {
          console.log("======> ", err);
          reject(err);
        } else {
          console.log("done with saving");
          resolve(res);
        }
      }
    );
  });
}
async function insertDataInKnowledgeGraph(insertCookieQuery) {
  const stream = await client.query.update(insertCookieQuery);
}

module.exports = router;
