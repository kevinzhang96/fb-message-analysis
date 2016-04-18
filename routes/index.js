var express = require('express');
var router = express.Router();

var fs = require('fs'),
  path = require('path')
  cheerio = require('cheerio')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', (req, res) => {
  fs.readFile(path.join("data", "sample.htm"), 'utf8', (err, data) => {
    if(err) {
      console.error("error reading")
      return;
    }
    var d = new Date()
    var messageData = cheerio.load(data)
    var threads = messageData(".thread")
    var names = threads.map((i, thread) => thread.childNodes[0].data)
    console.log(typeof names)
    // console.log(Object.keys(names))
    res.end()
  })
})

module.exports = router;
