const mongoose = require('mongoose')
const Schema = mongoose.Schema;


module.exports = function() {
  
  // SCHEMAS and MODELS: 

  // ADMIN ===================================
  const adminSchema = new Schema({

    adminname: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    last_login: {
      type: Date,
      default: Date.now
    },
    login_count: Number,
    gym_count: Number

  })

  const Admin = mongoose.model('Admin',adminSchema);

  // GYM ===================================

  const gymSchema = new Schema({
    gym_name: {
      type:String,
      required: true,
      unique: true
    },
    collection_name: {
      type: String,
      required: true
    },
    route_count: Number
  })

  const gym = mongoose.model('Gym', gymSchema);

  // CLIMBING ROUTES ===================================
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

  const gymARoute = mongoose.model('GymARoute',routeSchema);


  


}