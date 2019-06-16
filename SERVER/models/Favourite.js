const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const FavouriteSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  albumId : {
    type : Array,
    required : true
  },
  date : {
    type: Date,
    default: Date.now
  }
})

module.exports = Favourite = mongoose.model('favourites', FavouriteSchema)
