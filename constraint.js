// Trying to check against sh:PropertyShape
// const Ajv = require("ajv");

// const poi_schema = {
//   type: "object",
//   properties: {
//     name: {
//       type: "string",
//     },
//     address: {
//       addressLocality: {
//         type: "string",
//       },
//     },
//     geo: {
//       latitute: {
//         type: "float32",
//       },
//       longitude: {
//         type: "float32",
//       },
//     },
//   },
//   required: ["name"],
//   additionalProperties: false,
// };

// const ajv = new Ajv();

const fs = require("fs");

function validate_pois() {
  fs.readFile("./refined_data.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      const pois = JSON.parse(jsonString);
      //   console.log(ajv.validate(poi_schema, exp));
      pois.forEach((poi) => {
        if (
          is_Class_Place(poi) &&
          is_Class_GeoCoordinate(poi) &&
          is_Class_Address(poi) &&
          is_datatype_String(poi) &&
          is_datatype_Number(poi) &&
          is_datatype_Boolean(poi) &&
          is_minCount(poi)
        ) {
          return true;
        } else {
          return false;
        }
      });
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
}

// Property constraints----------------------------------------

// Class constraints-------------------------------------------
function is_Class_Place(poi) {
  if (poi["@type"] === "Place") {
    return true;
  } else {
    return false;
  }
}

function is_Class_GeoCoordinate(poi) {
  if (poi["geo"]["@type"] === "GeoCoordinates") {
    return true;
  } else {
    return false;
  }
}

function is_Class_Address(poi) {
  if (poi["address"]["@type"] === "PostalAddress") {
    return true;
  } else {
    return false;
  }
}

// Datatype constraints---------------------------------------
function is_datatype_String(poi) {
  if (typeof poi.name === typeof "Name") {
    return true;
  } else {
    return false;
  }
}

function is_datatype_Number(poi) {
  if (typeof poi["geo"].latitude === typeof 10.01) {
    return true;
  } else {
    return false;
  }
}

function is_datatype_Boolean(poi) {
  if (typeof poi.isAccessibleForFree === typeof true) {
    return true;
  } else {
    return false;
  }
}

// Count constraints-------------------------------------------
function is_minCount(poi) {
  if (poi.hasOwnProperty("geo")) {
    return true;
  } else {
    return false;
  }
}

export default validate_pois;
