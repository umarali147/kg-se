// import SparqlClient from "sparql-http-client";

// const endpointUrl = "http://localhost:7200/statements";
// const updateUrl = endpointUrl;
// // const user = "ontocookie";
// // const password = "ontocookie123456";

// const client = new SparqlClient({ endpointUrl, updateUrl, user, password });

// const annotate = (req, res) => {
//   const cookies = req.body;

//   var today = new Date();
//   var date =
//     today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

//   const insertUserQuery = `
//       PREFIX : <http://www.semanticweb.org/OntoCookie#>
//       PREFIX schema: <https://www.schema.org/>

//       INSERT DATA {:${cookies[0].userId} a <https://www.schema.org/Person>;
//             schema:identifier :${cookies[0].userId}.}
//       `;

//   insertDataInKnowledgeGraph(insertUserQuery);

//   for (let index = 0; index < cookies.length; index++) {
//     const element = cookies[index];
//     let element_domain = element.domain;
//     if (element_domain[0] === ".") {
//       element_domain = "";
//       for (let j = 1; j < element.domain.length; j++) {
//         element_domain += element.domain[j];
//       }
//     }

//     let cookieName = `Cookie_${element.userId}_${today.getTime()}_${index}`;

//     let insertCookieQuery;
//     if (JSON.parse(element.session) == true) {
//       insertCookieQuery = `
//         PREFIX : <http://www.semanticweb.org/OntoCookie#>

//         INSERT DATA {:${cookieName} a <http://www.semanticweb.org/OntoCookie#SessionCookie>;
//                :dateCreated :${date};
//                :hasDomain :${element_domain};
//                :name :${element.name} ;
//                :userId :${element.userId};.}
//         `;
//     } else {
//       insertCookieQuery = `
//         PREFIX : <http://www.semanticweb.org/OntoCookie#>

//         INSERT DATA {:${cookieName} a <http://www.semanticweb.org/OntoCookie#Cookie>;
//                :dateCreated :${date};
//                :expires :${element.expirationDate};
//                :hasDomain :${element_domain};
//                :name :${element.name} ;
//                :userId :${element.userId};.}
//         `;
//     }

//     insertDataInKnowledgeGraph(insertCookieQuery);
//   }

//   res.status(200).json({ message: "Cookies inserted successfully!" });
// };

// async function insertDataInKnowledgeGraph(insertCookieQuery) {
//   const stream = await client.query.update(insertCookieQuery);
// }

// export { annotate };

const express = require("express");
const router = express.Router();

// app.use(express.json());
// router.use((req, res, next) => {
//   console.log("Time: ", Date.now());
//   next();
// });

router.post("/", (req, res) => {
  const wifi = req.body;
  const names = Object.keys(wifi);

  for (let index = 0; index < names.length; index++) {
    const name = wifi[names[index]].name;

    const url = wifi[names[index]].url;
    const location = wifi[names[index]].location;
    const email = wifi[names[index]].contact.email;
    let focusArr = wifi[names[index]].state.focus;
    let focus = "";
    if (focusArr.includes("Public Free Wifi")) {
      focus = "Public Free Wifi";
    } else {
      focus = focusArr[0];
    }
    const lastChange = wifi[names[index]].state.lastchange;
    console.log(email);
  }
});

module.exports = router;
