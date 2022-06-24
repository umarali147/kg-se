const SparqlClient = require("sparql-http-client");
const express = require("express");
const router = express.Router();
const wifiData = require("../data.json");
const request = require("request");

const endpointUrl = "http://localhost:7200/repositories/wifipois/statements";
const updateUrl = endpointUrl;

const client = new SparqlClient({ endpointUrl, updateUrl });

router.post("/", async (req, res) => {
  const names = Object.keys(wifiData);
  console.log(names.length);
  let name,
    description,
    address,
    geo,
    url,
    isAccessibleForFree,
    publicAccess,
    telephone,
    lastChange;
  let annotations = [];
  for (let index = 0; index < names.length; index++) {
    const wifi = wifiData[names[index]];
    name = wifi.name;
    description = wifi.description || "";
    address = getAddress(wifi.location);
    geo = getGeoCoords(wifi.location);
    image = wifi.image || "";
    url = wifi.url || "";
    telephone = wifi?.contact?.phone || wifi?.phone || "";
    isAccessibleForFree = isAccessibleForFreeFunc(wifi?.state?.focus);
    publicAccess = isAccessibleForFree;
    lastChange = wifi.state.lastchange || "";
    techDetails = getTechDetails(wifi.techDetails);
    annotations.push({
      "@context": { "@vocab": "http://schema.org/" },
      "@type": "Place",
      "@id": getID(index, name),
      name,
      description,
      address,
      geo,
      url,
      telephone,
      isAccessibleForFree,
      publicAccess,
      lastChange,
      techDetails,
      lastChange,
    });
  }
  console.log({ annotations });
  // validate_pois();  May want to validate here?
  await save(endpointUrl, annotations);
  res.json(annotations);
});

async function save(endpointUrl, annotations) {
  return new Promise(function (resolve, reject) {
    request(
      {
        url: endpointUrl,
        headers: {
          Accept: "application/ld+json",
          "Content-Type": "application/ld+json",
        },
        method: "POST",
        body: annotations,
        json: true,
      },
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
}
function getID(index, name) {
  console.log(name);
  let date = Date.now();
  name = name.replace(/ /g, "_");
  return `http://example.com/${date}${index}/${name}/`;
}
function getAddress(location) {
  if (!location) return;
  let address = location.address || location;
  const addressObj = {
    "@type": "PostalAddress",
    streetAddress: address?.Street || address?.street || "",
    addressLocality: address?.city || address?.City || location?.city || "",
    postalCode: address?.zip || address?.zipcode || address?.Zipcode || "",
    addressCountry: location?.country || location?.address?.country || "",
  };
  return addressObj;
}
function getGeoCoords(location) {
  if (!location) return;
  const geoCoords = {
    "@type": "GeoCoordinates",
    latitude: location.lat,
    longitude: location.lon,
  };
  return geoCoords;
}
const getTechDetails = (techDetails) => {
  if (!techDetails) return;
  const techDetailsArray = [
    {
      "@type": "PropertyValue",
      name: techDetails?.firmware?.name || techDetails?.name,
    },
    {
      "@type": "PropertyValue",
      url: techDetails?.firmware?.url || techDetails?.url,
    },
  ];
  return techDetailsArray;
};
function isAccessibleForFreeFunc(arr) {
  if (!arr) return;
  return (
    arr.includes("Public Free Wifi") ||
    arr.includes("Free internet access") ||
    false
  );
}
module.exports = router;
