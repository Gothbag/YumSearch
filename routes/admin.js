var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/admin', function(req, res, next) {
  res.render('pages/admin/adminMain.ejs', { title: 'Home' });
});

module.exports = router;