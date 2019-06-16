const express = require('express')
const favourites = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const axios = require('axios');
const Favourite = require('../models/Favourite')

favourites.use(cors())

process.env.SECRET_KEY = 'secret'

// set favourite albums for particular user
favourites.post('/setFavouriteByUser', (req, res) => {
  const today = new Date();
  console.log(req.body);
  const userData = {
    userName : req.body.userName,
    albumIds : req.body.albumIds,
    created: today
  }
  console.log(userData);
  Favourite.findOne({
    userName : userData.userName
  })
  .then(val => {
    console.log(val);
      if(val!==null){
        console.log(val.albumId);
        let tracksDet = val.albumId;
        let index = tracksDet.indexOf(userData.albumIds);
        if(index===-1){
          tracksDet.push(userData.albumIds);
          val.albumId = tracksDet;
          val.save();
        }
      }
      else{
        Favourite.create(userData);
      }
  })
  .catch(err => {
    res.send('error: 1' + err)
  })
})


// remove favourites from particular user
favourites.post('/removeFavouriteByUser', (req, res) => {
  const removeData = {
    userName : req.body.userName,
    albumIds : req.body.albumId
  }
  console.log(removeData);
  Favourite.findOne({
    userName : removeData.userName
  }).then(val => {
    if(val!==null){
        let tracks = val.albumIds;
        let tracksCopy;
        tracksCopy = tracks.filter(function(value,index,arr){
            return value!==removeData.albumIds;
        })
        val.albumIds = tracksCopy;
        val.save();
    }
  })
})



// get all favourites for particular user
favourites.get('/getFavouriteByUser', (req, res) => {
  Favourite.findOne({
    userName : req.query.userName
  })
    .then(track => {
      if (track) {
        res.json(track)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

module.exports = favourites
