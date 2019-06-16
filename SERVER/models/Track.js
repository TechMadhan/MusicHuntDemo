const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const TracksSchema = new Schema({
  album_id : {
    type : String
  },
  album_title : {
    type : String
  },
  album_url : {
    type : String
  },
  track_composer : {
    type : String
  },
  track_duration : {
    type : String
  },
  track_favorites : {
    type : String
  },
  track_file : {
    type : String
  },
  track_id : {
    type : String
  },
  track_image_file : {
    type : String
  },
  track_lyricist : {
      type : String
  },
  track_title : {
      type : String
  },
  track_url : {
    type : String
  }
})

module.exports = Track = mongoose.model('tracks', TracksSchema)
