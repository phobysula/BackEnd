const router = require('express').Router()
const movieController = require('../controller/Movie')
const uploadSetting = require('../uploadConfig')
const fields = uploadSetting.upload.fields([
  {
    name: 'image',
    maxCount: 1
  }
])
const sharp = require('sharp')

router.post('/insert', fields, (req, res) => {
  const imageName = uploadSetting.cekNull(req.files['image'])

  const data = Object.assign(JSON.parse(req.body.data), {
    image: imageName
  })

  movieController.insertMovie(data)
    .then((result) => res.json(result))
    .catch((err) => res.json(err))
})

router.get('/coba', (req, res) => {
  sharp('statics/2020-08-10T12-24-18.219Z.jpg')
    .resize(600, 600)
    .toFile('coba.jpg', (err, info) => {
      if (err) {
        console.log(err)
      } else {
        console.log(info)
      }
    })
})

function arrToBox(arr) {
  return {
      minX: arr[0],
      minY: arr[1],
      maxX: arr[2],
      maxY: arr[3],
      id: arr[4]
  };
}
router.get('/getall', (req, res) => {
  movieController.getAllMovie()
    .then(result => res.json(result))
    .catch(err => res.json(err))
  // var RBush = require('rbush');
  // var knn = require('rbush-knn');

  // var tree = new RBush(); // create RBush tree
  // var data = [[20000000,21000000,21000000,22000000, '3'], [9000000,1000000,95000000,10500000, '4']].map(arrToBox);
  // tree.load(data);
  // // console.log(data) // bulk insert
  // var neighbors = knn(tree, 25000000, 20000000, data.length); 
  // console.log(neighbors)
})


router.get('/getbyid/:id', (req, res) => {
  movieController.getbyId(req.params.id)
    .then((result) => res.json(result))
    .catch((err) => res.json(err))
})

router.put('/edit/:id', fields,(req, res) => {
  const imageName = uploadSetting.cekNull(req.files['image'])

  let data = JSON.parse(req.body.data)
  let changeImage = false
  if (imageName) {
    changeImage = true
    data = Object.assign(data, {
      image: imageName,
      oldImage: data.image
    })
  }

  movieController.edit(data, req.params.id, changeImage)
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

router.delete('/delete/:id', (req, res) => {
  movieController.delete(req.params.id)
    .then(result => res.json(result))
    .catch(err => res.json(err))
})

module.exports = router