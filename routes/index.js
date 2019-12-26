var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var title = 'Tender Submission Registry. Tracing tender submissions from submission to contract awarding.';
  var title_main = 'Tender Submission Registry.';
  var title_sub = 'Tracing tender submissions from submission to contract awarding.';
  res.render('index', { title: title, title_main: title_main, title_sub: title_sub  });
});

/* GET test page. */
router.get('/index2', function(req, res, next) {
  var title = 'Tender Submission Registry. Tracing tender submissions from submission to contract awarding.';
  var title_main = 'Tender Submission Registry.';
  var title_sub = 'Tracing tender submissions from submission to contract awarding.';
  res.render('index2', { title: title, title_main: title_main, title_sub: title_sub  });
});


module.exports = router;
