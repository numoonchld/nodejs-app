const mongoose = require('mongoose')

// GYM SCHEMA AND MODEL: ---------------------------

const Schema = mongoose.Schema

const gymSchema = new Schema({
    gym_name: {
      type:String,
      required: true,
      unique: true
    },
    model_name: String,
    route_count: Number,
    created: {
      type: Date,
      default: Date.now()
    }
})

module.exports = mongoose.model('Gym', gymSchema);