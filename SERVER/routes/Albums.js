const express = require('express')
const album = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const axios = require('axios');
const Album = require('../models/Album')
const Favourite = require('../models/Album');
const Track = require('../models/Track');
album.use(cors())
const request = require('request');
process.env.SECRET_KEY = 'secret'

album.get('/getAllAlbums', (req, res) => {
    Album.find().then(response => {
      res.send(response);
    })

    // let count = 0;
    // Album.find().then(response => {
    //   response.forEach(function(val){
          // request("https://freemusicarchive.org/api/get/tracks.json?api_key=CFEFES9JPKBN4T7H&album_id="+val.album_id, {json:true}, (err,res1, body) => {
                // let obj = {
                //   album_id : val.album_id,
                //   album_title : val.album_title,
                //   album_url : val.album_url,
                //   track_composer : val.track_composer,
                //   track_duration : val.track_duration,
                //   track_favorites : val.track_favorites,
                //   track_file : val.track_file,
                //   track_id : val.track_id,
                //   track_image_file : val.track_image_file,
                //   track_lyricist  : val.track_lyricist,
                //   track_title : val.track_title,
                //   track_url : val.track_url
                // }
                // count += Number(val.album_tracks);
                // console.log(count);
                // Track.create(obj);
          // })
      // })
    // })
})

// albums.get('/getAlbumsById', (req, res) => {
//
// })

module.exports = album
