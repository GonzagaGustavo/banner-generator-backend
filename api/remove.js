const route = require('express').Router()
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const uploadUser = require('./midleware/upload')

route.post("/generate", (req, res) => {
  //Remover o fundo da Imagem da cerveja
// const formData = new FormData();
// formData.append('size', 'auto');
// formData.append('image_url', req.body.i.img)

// axios({
//     method: 'post',
//     url: 'https://api.remove.bg/v1.0/removebg',
//     data: formData,
//     responseType: 'arraybuffer',
//     headers: {
//       ...formData.getHeaders(),
//       'X-Api-Key': '2BGN7JeR31boSZ4Hk2cVFjUE',
//     },
//     encoding: null
//   })
//   .then((response) => {
//     if(response.status != 200) return console.error('Error:', response.status, response.statusText);
//     fs.writeFileSync("noBack.png", response.data);
//   })
//   .catch((error) => {
//       return console.error('Request failed:', error);
//   });
  //Removeu o fundo
console.log(req)
})
route.post("/upload",uploadUser.single('image'), async (req, res) => {
  if(req.file) {
    res.send("Upload Realizado")
  } else {
    res.status(400).send("Erro no upload!")
  }
})

module.exports = route