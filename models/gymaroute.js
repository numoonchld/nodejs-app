const mongoose = require('mongoose')

// ADMIN SCHEMA AND MODEL: ---------------------------

const Schema = mongoose.Schema

  // CLIMBING ROUTES SCHEMA AND MODEL: ---------------------------
  const climberSchema = new Schema({
    climberIP: {
      type: String,
      required: true,
      unique: true
    },
    climberGrade: {
      type: String,
      required: true
    },
    climber_rating: {
      type: Number
    },
    created: {
      type: Date,
      default: Date.now()
    }
  })

  const setterSchema = new Schema({
    setter_grade: {
      type: String,
      required: true
    },
    updated: {
      type: Date,
      default: Date.now()
    }
  })

  const routeSchema = new Schema({
    route_name: {
      type: String,
      required: true,
      unique: true
    },
    gym_name:{
      type: String,
      required: true
    },
    setter_input: setterSchema,
    climber_opinions: [climberSchema]
  })

module.exports = mongoose.model('GymARoute',routeSchema)