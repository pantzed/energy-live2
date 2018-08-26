const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {
  console.log(req.body);
  console.log(true);
  res.render('historical', { title: 'Energy Live' });
});

module.exports = router;
