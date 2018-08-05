var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/historical', function(req, res, next) {
  res.render('historical', { title: 'Historical Energy' });
});

module.exports = router;
