var express = require('express');
var router = express.Router();

// This is the template for updating route rating:


/* GET users listing. */
router.get('/', function(req, res, next) {

  // List Gyms:
  res.render('climber-ui');


});

module.exports = router;
