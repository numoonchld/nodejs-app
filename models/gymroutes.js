const mongoose = require('mongoose')

// ADMIN SCHEMA AND MODEL: ---------------------------

const Schema = mongoose.Schema

// function rockClimbingGradeValidate(entry) {
//   let allowed 
//   return entry
// }


// CLIMBING ROUTES SCHEMA AND MODEL: ---------------------------
const climberSchema = new Schema({
  climber_IP: {
    type: String,
    required: true
  },
  climber_grade: {
    type: Number,
    required: true,
    min: 5.5,
    max: 5.13
  },
  climber_rating: {
    type: Number,
    min: 0,
    max: 4
  },
  created: {
    type: Date,
    default: Date.now()
  }
})

const setterSchema = new Schema({
  setter_grade: {
    type: Number,
    required: true,
    min: 5,
    max: 14
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
  created: {
    type: Date,
    default: Date.now()
  },
  gym_name:{
    type: String,
    required: true
  },
  setter_input: setterSchema,
  climber_opinions: [climberSchema],
  current_grade_average: {
    type: Number,
    required: true
  },
  current_star_rating: {
    type: Number,
    required: true,
    min: 0,
    max: 4
  }
})

module.exports = function(filteredGymName){
  return mongoose.model(filteredGymName,routeSchema)
}