const express = require("express");
const https = require("https");
const xml2js = require("xml2js");
const bodyParser = require("body-parser");
const cors = require('cors')
const stripPrefix = require('xml2js').processors.stripPrefix;
const parser = new xml2js.Parser({ explicitArray: false, tagNameProcessors: [ stripPrefix ], attrNameProcessors: [ stripPrefix ]});
const app = express();
const port = 8080;

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: "true" }));

app.post("/", (req, res) => {
  
  let reu = https.get(
    "https://www.emporiodacerveja.com.br/XMLData/googleshoppingalta.xml",
    function (ress) {
      let data = "";
      ress.on("data", function (stream) {
        data += stream;
      });
      ress.on("end", function () {
        parser.parseString(data, function (error, result) {
          if (error === null) {
            for (let i = 0; i < result.feed.entry.length; i++) {
              if (JSON.stringify(result.feed.entry[i].id) == `"${req.body.id}"`) {
                const e = JSON.stringify(result.feed.entry[i])
                res.send(e)
                // res.send({
                //   id: e.id,
                //   name: e.title,
                //   price: 
                // })
                break;
              }
            }
          } else {
            console.log(error);
          }
        });
      });
    }
  );
});

app.listen(port, () => console.log(`Porta ${port}`));
