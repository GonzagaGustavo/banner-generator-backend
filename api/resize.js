const path = require("path");
const sharp = require("sharp");

const filepath = __dirname + "/public/a.png";
const [filename, extenxion] = path.basename(filepath).split(".");

const destination = `${__dirname}/public`;
const sizes = [1000, 430];

//Deixa a imagem do produto com o tamanho certo
// sharp(__dirname + '/no-bg.png')
//   .clone()
//   .resize({ width: 400, height: 400})
//   .toFile(`${destination}/noBg-end.png`)
//   .then(info => {
//     console.log(info)
//   }).catch(error => {
//     console.log(error)
//   })

sharp(filepath)
  .clone()
  .resize({ width: 1000, height: 430 })
  .composite([{
    input: `${__dirname}/public/noBg-end.png`, top: 15, left: 30
  }, { input: `${destination}/bru.png` }])
  .toFile(`${destination}/${filename}-end.jpg`)
  .then(info => {
    console.log(info)
  }).catch(error => {
    console.log(error)
  })

// sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="1000" height="430" viewBox="0 0 1000 430" xml:space="preserve">
// <text font-size="40" dy="40%" dx="40%" fill="red">Cerveja Colorado Indica 600ml</text>
// <text font-size="30" dy="51%" dx="40%" fill="red">R$ 9,09</text>
// <text font-size="20" dy="61%" dx="40%" fill="red">1x de 9.09 BRL</text>
// </svg>`))
//   .png()
//   .toFile(`${destination}/bru.png`)
//   .then(function (info) {
//     console.log(info);
//   })
//   .catch(function (err) {
//     console.log(err);
//   });
