const SparqlClient = require("sparql-http-client");
const express = require("express");
const router = express.Router();

const endpointUrl = "http://localhost:7200/repositories/data/statements";
const updateUrl = endpointUrl;

const client = new SparqlClient({ endpointUrl, updateUrl });
router.post("/", (req, res) => {
  const wifi = req.body;
  const names = Object.keys(wifi);
  let name, url, location, email, focus;
  for (let index = 0; index < names.length; index++) {
    name = wifi[names[index]].name;
    url = wifi[names[index]].url;
    location = wifi[names[index]].location;
    email = wifi[names[index]].contact.email;
    let focusArr = wifi[names[index]].state.focus;
    focus = "";
    if (focusArr.includes("Public Free Wifi")) {
      focus = "Public Free Wifi";
    } else {
      focus = focusArr[0];
    }
    const lastChange = wifi[names[index]].state.lastchange;
    console.log(name, url, location, email, focus);
  }

  let insertCookieQuery;
  insertCookieQuery = `
    PREFIX : <https://www.schema.org/>
        INSERT DATA {:${name} a <http://www.semanticweb.org/OntoCookie#Wifi>;
               :url :${url};
               :name :${name};
               :location :${location};
               :focus :${focus};
               :email :${email};.}
        `;
  console.log({ insertCookieQuery });
  // insertCookieQuery = `PREFIX dc: <http://purl.org/dc/elements/1.1/>
  // INSERT DATA
  // {
  //   <http://example/book1> dc:title "A new book" ;
  //                          dc:creator "A.N.Other" .
  // }`;
  insertDataInKnowledgeGraph(insertCookieQuery);
  res.json("done");
});
async function insertDataInKnowledgeGraph(insertCookieQuery) {
  const stream = await client.query.update(insertCookieQuery);
}

module.exports = router;
