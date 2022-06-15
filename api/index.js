const express = require("express");
const https = require("https");
const xml2js = require("xml2js");
const bodyParser = require("body-parser");
const cors = require("cors");
const sharp = require("sharp");
const { default: axios } = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const uploadUser = require("./midleware/upload");
const path = require("path");
const stripPrefix = require("xml2js").processors.stripPrefix;
const parser = new xml2js.Parser({
  explicitArray: false,
  tagNameProcessors: [stripPrefix],
  attrNameProcessors: [stripPrefix],
});

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: "true" }));
app.use("/files", express.static(path.resolve(__dirname, "public")))

app.post("/upload", uploadUser.single("image"), async (req, res) => {
  if (req.file) {
    console.log(req.file.mimetype)
    sharp(__dirname + `/public/background.${req.file.mimetype.substring(6, 10)}`)
      .toFile(__dirname + "/public/background.jpg")
      .then((info) => {
        console.log(info);
      })
      .catch((error) => {
        console.log(error);
      });
    res.send("Upload Realizado");
  } else {
    res.status(400).send("Erro no upload!");
  }
});
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
              if (
                JSON.stringify(result.feed.entry[i].id) == `"${req.body.id}"`
              ) {
                const e = result.feed.entry[i];
                res.send([
                  {
                    id: e.id,
                    name: e.title,
                    price: e.price,
                    p_value: e.installment.amount,
                    p_mounth: e.installment.months,
                    img: e.image_link,
                  },
                ]);
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

app.post("/createBanner", async (req, res) => {
  const formData = new FormData();
  formData.append("size", "auto");
  formData.append("image_url", req.body[0].img);
  await axios({
    method: "post",
    url: "https://api.remove.bg/v1.0/removebg",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      ...formData.getHeaders(),
      "X-Api-Key": "2y7bHbBruVqujjkq23DCn9fh",
    },
    encoding: null,
  })
    .then((response) => {
      if (response.status != 200)
        return console.error("Error:", response.status, response.statusText);
      fs.writeFileSync(__dirname + "/public/resize.png", response.data);
    })
    .catch((error) => {
      return console.error("Request failed:", error);
    });

await sharp(__dirname + '/public/resize.png')
  .clone()
  .resize({ width: 400, height: 400})
  .toFile(__dirname + '/public/product.png')
  .then(info => {
    console.log(info)
  }).catch(error => {
    console.log(error)
  })

  await sharp(
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="1000" height="430" viewBox="0 0 1000 430" xml:space="preserve">
<text font-size="40" dy="40%" dx="40%" fill="red">${req.body[0].name}</text>
<text font-size="30" dy="51%" dx="40%" fill="red">${req.body[0].price}</text>
<text font-size="20" dy="61%" dx="40%" fill="red">${req.body[0].p_mounth}x de ${req.body[0].p_value}</text>
</svg>`)
  )
    .png()
    .toFile(__dirname + '/public/text.png')
    .then(function (info) {
      console.log(info);
    })
    .catch(function (err) {
      console.log(err);
    });

    await sharp(__dirname + '/public/background.jpg')
    .clone()
    .resize({ width: 1000, height: 430 })
    .composite([{
      input: `${__dirname}/public/product.png`, top: 15, left: 30
    }, { input: `${__dirname}/public/text.png` }])
    .toFile(`${__dirname}/public/banner.jpg`)
    .then(info => {
      console.log(info)
    }).catch(error => {
      console.log(error)
    })
    res.send("http://localhost:8080/files/banner.jpg")
});

app.listen(port, () => console.log(`Porta ${port}`));
