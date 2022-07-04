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
const express = require("express");
const router = express.Router();
const fs = require("fs");
const moment = require("moment");
moment.suppressDeprecationWarnings = true;
router.get("/", async (req, res) => {
  res.json(await validate_pois());
});
async function validate_pois() {
  const jsonString = fs.readFileSync("./refined_data.json", "utf8");
  // (err, jsonString) => {

  try {
    // if (err) {
    //   console.log("Error reading file from disk:", err);
    //   return;
    // }
    const pois = JSON.parse(jsonString);

    //   console.log(ajv.validate(poi_schema, exp));
    let res_array = new Array();
    for (const poi of pois) {
      res_array.push(is_Class_Place(poi));
      res_array.push(is_Class_GeoCoordinate(poi));
      res_array.push(is_Class_Address(poi));
      res_array.push(is_datatype_String(poi));
      res_array.push(is_datatype_Number(poi));
      res_array.push(is_datatype_Boolean(poi));
      res_array.push(is_datatype_Url(poi));
      res_array.push(is_datatype_DateTime(poi));
      res_array.push(is_minCount(poi));
    }
    return res_array;
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
}

// Class constraints-------------------------------------------
function is_Class_Place(poi) {
  if (poi["@type"] !== "Place") {
    return {
      id: poi["@id"],
      property: "@type",
      value: poi["@type"],
      constraint: "sh:class",
    };
  } else {
    return {
      id: poi["@id"],
      property: null,
      value: null,
      constraint: null,
    };
  }
}

function is_Class_GeoCoordinate(poi) {
  if (poi["geo"]["@type"] !== "GeoCoordinates") {
    return {
      id: poi["@id"],
      property: "geo:@type",
      value: poi["geo"]["@type"],
      constraint: "sh:class",
    };
  } else {
    return {
      id: poi["@id"],
      property: null,
      value: null,
      constraint: null,
    };
  }
}

function is_Class_Address(poi) {
  if (poi["address"]["@type"] !== "PostalAddress") {
    return {
      id: poi["@id"],
      property: "address:@type",
      value: poi["address"]["@type"],
      constraint: "sh:class",
    };
  } else {
    return {
      id: poi["@id"],
      property: null,
      value: null,
      constraint: null,
    };
  }
}

// Datatype constraints---------------------------------------
function is_datatype_String(poi) {
  if (typeof poi.name !== typeof "Name") {
    return {
      id: poi["@id"],
      property: "Name",
      value: poi.name,
      constraint: "sh:datatype",
    };
  } else {
    return {
      id: poi["@id"],
      property: null,
      value: null,
      constraint: null,
    };
  }
}

function is_datatype_Number(poi) {
  if (
    typeof poi["geo"].latitude !== typeof 10.01 ||
    typeof poi["geo"].longitude !== typeof 10.01
  ) {
    return {
      id: poi["@id"],
      property: "geo",
      value: { lat: poi["geo"].latitude, long: poi["geo"].longitude },
      constraint: "sh:datatype",
    };
  } else {
    return {
      id: poi["@id"],
      property: null,
      value: null,
      constraint: null,
    };
  }
}

function is_datatype_Boolean(poi) {
  if (typeof poi.isAccessibleForFree !== typeof true) {
    return {
      id: poi["@id"],
      property: "isAccessibleForFree",
      value: poi.isAccessibleForFree,
      constraint: "sh:datatype",
    };
  } else {
    return {
      id: poi["@id"],
      property: null,
      value: null,
      constraint: null,
    };
  }
}

function is_datatype_Url(poi) {
  var regexp =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

  if (!regexp.test(poi.url)) {
    return {
      id: poi["@id"],
      property: "url",
      value: poi.url,
      constraint: "sh:datatype",
    };
  } else {
    return {
      id: poi["@id"],
      property: null,
      value: null,
      constraint: null,
    };
  }
}

function is_datatype_DateTime(poi) {
  var isDate = function (date) {
    return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
  };

  if (!moment(poi.lastChange).isValid()) {
    return {
      id: poi["@id"],
      property: "lastChange",
      value: poi.lastChange,
      constraint: "sh:datatype",
    };
  } else {
    return {
      id: poi["@id"],
      property: null,
      value: null,
      constraint: null,
    };
  }
}

// Count constraints-------------------------------------------
function is_minCount(poi) {
  if (!poi.hasOwnProperty("geo")) {
    return {
      id: poi["@id"],
      property: "geo",
      value: 1,
      constraint: "sh:minCount",
    };
  } else {
    return {
      id: poi["@id"],
      property: null,
      value: null,
      constraint: null,
    };
  }
}
// TODO: The array is returned as undefined for some reason
const res = validate_pois();
// console.log(res);
module.exports = router;
// export default validate_pois;
