var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var title = 'Tender Submission Registry. Tracing tender submissions from submission to contract awarding.';
  res.render('index', { title: title });
});

/* GET test page. */
router.get('/index2', function(req, res, next) {
  var title = 'Tender Submission Registry. Tracing tender submissions from submission to contract awarding.';
  res.render('index2', { title: title });
});


module.exports = router;
