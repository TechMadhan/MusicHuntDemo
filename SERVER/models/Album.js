const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const AlbumSchema = new Schema({
  album_id : {
    type : String,
    require : true
  },
  album_title : {
    type : String,
    require : true
  },
  album_url : {
    type : String,
    require : true
  },
  album_type : {
    type : String,
    require : true
  },
  album_tracks : {
    type : String,
    require : true
  },
  album_listens : {
    type : String,
    require : true
  },
  album_image_file : {
    type  :String,
    require : true
  },
  date : {
    type: Date,
    default: Date.now
  }
})

module.exports = Album = mongoose.model('albums', AlbumSchema)
