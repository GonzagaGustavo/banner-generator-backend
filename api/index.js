const connection = require("./connection");
const express = require("express");
const https = require("https");
const xml2js = require("xml2js");
const bodyParser = require("body-parser");
const cors = require("cors");
const sharp = require("sharp");
const { default: axios } = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const uploadUser = require("./midleware/upload");
const uploadXml = require("./midleware/uploadXml");
const path = require("path");
const router = require("./Login/routes");
const stripPrefix = require("xml2js").processors.stripPrefix;
const parser = new xml2js.Parser({
  explicitArray: false,
  tagNameProcessors: [stripPrefix],
  attrNameProcessors: [stripPrefix],
});
const url = require('url')

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: "true" }));
sharp.cache(false);
app.use("/files", express.static(path.resolve(__dirname, "public")));
app.use("/users", router);

app.get('/rotas', function(req, res) {
    fs.readFile(__dirname + '/Views/routes.html', null, (err, data) => {
      if(err) {
        res.write('Whoops! File not found!');
      } else {
        res.write(data);
      }
      res.end()
    })
});
fs.mkdir(path.join(__dirname, "public"), (err) => {
  if (err) {
    return console.error(err);
  }
  console.log("Directory created successfully!");
});
const a = new url.URL("https://bannergenerator.herokuapp.com/")
app.get("/", (req, res) => {
  res.send("<a href='https://banner-generatorrg.netlify.app/'>Entre</a>");
});

app.post("/upload", uploadUser.single("image"), async (req, res) => {
  if (req.file) {
    console.log(req.file.mimetype);
    sharp(
      __dirname + `/public/background.${req.file.mimetype.substring(6, 10)}`
    )
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
  let reu = https.get(req.body.link, function (ress) {
    let data = "";
    ress.on("data", function (stream) {
      data += stream;
    });
    ress.on("end", function () {
      parser.parseString(data, function (error, result) {
        if (error === null) {
          for (let i = 0; i < result.feed.entry.length; i++) {
            if (JSON.stringify(result.feed.entry[i].id) == `"${req.body.id}"`) {
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
              break;
            }
          }
        } else {
          console.log(error);
        }
      });
    });
  });
});
app.post("/createBanner", async (req, res) => {
  const formData = new FormData();
  formData.append("size", "auto");
  formData.append("image_url", req.body.dados.img);
  await axios({
    method: "post",
    url: "https://api.remove.bg/v1.0/removebg",
    data: formData,
    responseType: "arraybuffer",
    headers: {
      ...formData.getHeaders(),
      "X-Api-Key": "29JZNXepU1EBCpnRwk3XoSAo",
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

  await sharp(__dirname + "/public/resize.png")
    .resize({ width: 400, height: 400 })
    .toFile(__dirname + "/public/product.png")
    .then((info) => {
      console.log(info);
    })
    .catch((error) => {
      console.log(error);
    });

  await sharp(
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="1000" height="430" viewBox="0 0 1000 430" xml:space="preserve" style="padding: 2em">
<defs>
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css?family=${req.body.personalization.font}:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic');
   </style>
  </defs>
  <text style="font-family: '${req.body.personalization.font}, sans-serif';" font-size="${req.body.personalization.size1}" dy="40%" dx="30%" fill="${req.body.personalization.color}">${req.body.dados.name}</text>
    <text style="font-family: '${req.body.personalization.font}';"  font-size="${req.body.personalization.size2}" dy="51%" dx="30%" fill="${req.body.personalization.color}">${req.body.dados.price}</text>
    <text style="font-family: '${req.body.personalization.font}';" font-size="${req.body.personalization.size3}" dy="61%" dx="30%" fill="${req.body.personalization.color}">${req.body.dados.adiconalText}</text>
</svg>`)
  )
    .png()
    .toFile(__dirname + "/public/text.png")
    .then(function (info) {
      console.log(info);
    })
    .catch(function (err) {
      console.log(err);
    });

  await sharp(__dirname + "/public/background.jpg")
    .resize({ width: 1000, height: 430 })
    .composite([
      {
        input: `${__dirname}/public/product.png`,
        top: 15,
        left: 30,
      },
      { input: `${__dirname}/public/text.png` },
    ])
    .toFile(`${__dirname}/public/banner.jpg`)
    .then((info) => {
      console.log(info)
      res.send(a.href + "files/banner.jpg");
    })
    .catch((error) => {
      res.status(400).send("Erro ao gerar o banner!")
      console.log(error);
    });
  console.log(a.href)
});
app.get("/apagar", (req, res) => {
  fs.rm("./public", { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Directory Deleted!");
      fs.mkdir(path.join(__dirname, "public"), (err) => {
        if (err) {
          return console.error(err);
        }
        console.log("Directory created successfully!");
        res.send("Clean Directory");
      });
    }
  });
});

app.post("/baixarXML", uploadXml.single("XML"), async (req, res) => {
  res.send(req.file.filename);
});
app.post("/buscarAqv", (req, res) => {
  console.log(req.body.file);
  fs.readFile(__dirname + `/public/${req.body.file}`, (err, data) => {
    parser.parseString(data, function (error, result) {
      if (error === null) {
        for (let i = 0; i < result.feed.entry.length; i++) {
          if (JSON.stringify(result.feed.entry[i].id) == `"${req.body.id}"`) {
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
            break;
          }
        }
      } else {
        console.log(error);
      }
    });
  });
});

app.listen(port, () => console.log(`Porta ${port}`));
