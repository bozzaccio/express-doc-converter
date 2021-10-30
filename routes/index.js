var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('doc-converter', { title: 'Word to Pdf Converter' });
});

module.exports = router;
