var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
const mongoose = require('mongoose')
var port = process.env.PORT || 5000
var request = require('request');
app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

// const mongoURI = 'mongodb://localhost:27017/mernloginreg'
const mongoURI = "mongodb+srv://codingmart42:codingmart42@musichunt01-4ybzp.mongodb.net/musicHunt";

mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

var Users = require('./routes/Users')

var Favourites = require('./routes/Favourites');

var Albums = require('./routes/Albums');

app.use('/users', Users)

app.use('/tracks',Favourites)

app.use('/albums', Albums);


// Direct API call
app.get('/allAlbums', function(req, res){
  request("https://freemusicarchive.org/api/get/albums.json?api_key=CFEFES9JPKBN4T7H&limit=10#", {json : true}, (err,response,body) => {
     res.send(response)
  });
})

// app.get('/testing', function(req,res){
//       const fs = require('fs')
//       let jsonData = []
//       fs.readFile('/home/lenovo/Desktop/musicHuntAlbums1000.json', 'utf-8', (err, data) => {
//         if (err) throw err
//
//         jsonData = JSON.parse(data);
//         var objArr = [];
//         for(let val in jsonData.dataset){
//            let obj = {
//              album_id : jsonData.dataset[val].album_id,
//              album_title : jsonData.dataset[val].album_title,
//              album_url :  jsonData.dataset[val].album_url,
//              album_type :  jsonData.dataset[val].album_type,
//              album_tracks :  jsonData.dataset[val].album_tracks,
//              album_listens :  jsonData.dataset[val].album_listens,
//              album_image_file :  jsonData.dataset[val].album_image_file
//            }
//            objArr.push(obj);
//         }
//         Album.insertMany(objArr);
//       })
// })

app.get('/getAllTracksByAlbumId', function(req, res){
  request("https://freemusicarchive.org/api/get/tracks.json?api_key=CFEFES9JPKBN4T7H&album_id=" +req.query.albumId, {json : true}, (err, response, body) =>{
    res.send(response);
  })
})

app.get('/getFavouriteByTrackId', function(req,res){
    request("https://freemusicarchive.org/api/get/tracks.json?api_key=CFEFES9JPKBN4T7H&track_id="+req.query.trackId, {json:true}, (err,response, body) => {
          res.send(response);
    })
})

// app.get('/allTracks', function(req,res){
//   request("https://freemusicarchive.org/api/get/tracks.json?api_key=CFEFES9JPKBN4T7H&limit=10#", { json: true }, (err, response, body) => {
//           res.send({name : response})
//   });
// })

app.listen(process.env.port||port, function() {
  console.log('Server is running on port: ' + port)
})
