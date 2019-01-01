var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ADMIN ACCESS' });
});

router.post('/admin', function(req, res, next) {
  console.log(req.body, req.body.adminname, req.body.password );
  // TODO: Authetication
  res.send('the gym selector page will load, (authentication implementation pending)');
});

module.exports = router;
