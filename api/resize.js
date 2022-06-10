const path = require("path");
const sharp = require("sharp");

const filepath = __dirname + "/no-bg.png";
const [filename, extenxion] = path.basename(filepath).split(".");

const destination = `${__dirname}/public`;
const sizes = [1000, 430];

sharp(filepath)
  .clone()
  .resize({ width: 1000, height: 430 })
  .toFile(`${destination}/${filename}-1000_430.jpg`)
  .then(info => {
    console.log(info)
  }).catch(error => {
    console.log(error)
  })
