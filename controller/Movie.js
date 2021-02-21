const movieModel = require('../model/Movie')
const { requestResponse } = require('../config')
const objectId = require('mongoose').Types.ObjectId
const { deleteImage } = require('../uploadConfig')
exports.insertMovie = (data) =>
  new Promise((resolve, reject) => {
    movieModel.create(data)
    .then(() => resolve(requestResponse.sukses('Berhasil Input Movie')))
    .catch(() => reject(requestResponse.serverError))
  })

exports.getAllMovie = () =>
  new Promise((resolve, reject) => {
    movieModel.find({})
      .then(movie => resolve(requestResponse.suksesWithData(movie)))
      .catch(error => reject(requestResponse.serverError))
  })

exports.getbyId = (id) =>
  new Promise((resolve, reject) => {
    movieModel.findOne({
      _id: objectId(id)
    }).then(movie => resolve(requestResponse.suksesWithData(movie)))
    .catch(error => reject(requestResponse.serverError))
  })

exports.edit = (data, id, changeImage) =>
  new Promise(async(resolve, reject) => {
    movieModel.updateOne({
      _id: objectId(id)
    }, data)
      .then(() => {
        if (changeImage) {
          deleteImage(data.oldImage)
        }
        resolve(requestResponse.sukses('Berhasil Edit Movie'))
      }).catch(() => reject(requestResponse.serverError))
  })

exports.delete = (id) =>
  new Promise((resolve, reject) => {
    movieModel.findOne({
      _id: objectId(id)
    }).then(movie => {
      movieModel.deleteOne({
        _id: objectId(id)
      }).then(() => {
        deleteImage(movie.image)
        resolve(requestResponse.sukses('Berhasil Delete Movie'))
      }).catch(() => reject(requestResponse.serverError))
    })
  })