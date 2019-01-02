const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// initializes collections in empty database:

module.exports = function(first_compile, cz_db) {
  
  console.log("Is first compile? - ", first_compile)

  if (first_compile) {

    cz_db.once('open', function(){

      // SCHEMAS: ===================================

      // ADMIN ---------------------------
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

      // GYM ---------------------------

      const gymSchema = new Schema({
        gym_name: {
          type:String,
          required: true,
          unique: true
        },
        model_name: String,
        route_count: Number
      })

      // CLIMBING ROUTES ---------------------------
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

      // MODELS: ===================================
      
      const Admin = mongoose.model('Admin',adminSchema)
      const Gym = mongoose.model('Gym', gymSchema);
      const GymARoute = mongoose.model('GymARoute',routeSchema)
      
      // TODO: create default admin login and password:
      Admin.create({adminname: 'admin', password: 'password'})

      // TODO: initialize three gyms:
      Gym.insertMany([{gym_name: 'GYM A', model_name: 'gymaroute', route_count: 20},{gym_name: 'GYM B'},{gym_name: 'GYM C'}])

      // TODO: initilize twenty routes in first gym: 
      GymARoute.insertMany([{route_name: 'Route 1',gym_name: 'Gym A',climber_opinions:[]}])

      // mongoose.disconnect()

    })
  }

}