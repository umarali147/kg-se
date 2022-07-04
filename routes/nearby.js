const express = require("express");
const router = express.Router();
const helper = require("../helper.js");
const config = require("../config.json");
let wifiUrl = `${config.graphDBURL}/repositories/${config.wifiRepo}`;
let gtUrl = `${config.graphDBURL}/repositories/${config.germanTourismRepo}`;

router.get("/", async (req, res) => {
  const wifiEntitiesWithGeoQuery = helper.getWifiEntitiesWithGeo();
  const entities = (await helper.sparql(wifiEntitiesWithGeoQuery, wifiUrl))
    .results.bindings;
  const getList = await getNearByList(entities);
  res.json(getList);
});

const getNearByList = async (entities) => {
  const listArray = [];
  for (const element of entities) {
    const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX schema: <https://schema.org/>
    PREFIX omgeo:   <http://www.ontotext.com/owlim/geo#>
    insert {
        ?entity schema:nearby <${element?.entity?.value}>.
    } 
     where  {
    	?entity rdf:type schema:LodgingBusiness.
        ?entity schema:geo ?geo.
        ?geo schema:latitude ?lat.
        ?geo schema:longitude ?lon.
        FILTER( omgeo:distance(?lat, ?lon, ${element?.lat?.value}, ${element?.long?.value}) < (0.1))
    }`;

    const result = await helper.updateSparql(query, gtUrl);
    // if (result.results.bindings.length > 0) {
    //   const ele = { [element.entity.value]: result.results.bindings };
    //   listArray.push(ele);
    // }
    if (entities.indexOf(element) === entities.length - 1) {
      return listArray;
    }
  }
};

module.exports = router;
