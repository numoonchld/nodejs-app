const express = require('express')
const router = express.Router()
const app = require('../app')

require('dotenv').config()

const mongoose = require('mongoose')
const adminModels = require('../admin/mon-models')
adminModels();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ADMIN ACCESS' });
});

/* GET admin login page */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'LOGIN' });
});

router.post('/admin', function(req, res, next) {
  console.log(req.body, req.body.adminname, req.body.password);

  // TODO: Input validation

  // if input valid, connect to db and check credentials
  if (req.body.adminname === 'admin' && req.body.password === 'password') { 

    res.render('admin-gyms', { gymList: ['Gym A', 'Gym B', 'Gym C'] });

      // TODO: Authetication
      // if in-correct credentials, dont render gym admin page

      // if correct credentials, login and get array of gyms, send to pug page to render 

      // render list of gyms
      // res.render('admin-gyms', { gymList: ['Gym A', 'Gym B', 'Gym C'] });

  } else {
    res.json({under_construction: "invalid login credentials"})
  }
  

});

router.get('/admin/:gym', function(req,res){
  res.render('admin-gym-routes', { gym: ['Route 1', 'Route 2', 'Route 3'] });
})

router.post('/admin/reset-db', function(req,res){
  res.json({under_construction: 'reset database to default values'})
})


// Create new collections and documents:
router.post('/admin-create/gym', function(req,res){
  // TODO: Add new model for each new gym created 
  res.json({under_construction: 'page to create new gym '})
})

router.post('/admin-create/gym-route', function(req,res){
  // TODO: Add new route in gym collection for each new route created 
  res.json({under_construction: 'page to create new route in current gym'})
})



module.exports = router;
