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

  var name = req.query.name;

  fs.readFile(path.join("data", "sample.htm"), 'utf8', (err, data) => {
    if(err) {
      console.error("error reading")
      return;
    }

    var messageData = cheerio.load(data)
    var threads = messageData(".thread")
    var threadsArray = [];
    threads.each((i, thread) => { threadsArray.push(thread); });

    var messages = {}
    var x = 0;
    threadsArray.forEach(thread => {
      console.log(`${x++}`)
      var participants = thread.childNodes[0].data
      if(participants.split(",").length == 2) {
        var other = participants.replace(name, "").replace(",", "").trim()
        var conversation = []
        for(var i = 1; i < thread.childNodes.length; i++) {
          if(i % 2 == 1) {
            var sender = thread.childNodes[i].childNodes[0].childNodes[0].childNodes[0].data;
            var dateString = thread.childNodes[i].childNodes[0].childNodes[1].childNodes[0].data;
            var ampm = dateString.match(/\d\dpm /g) ? 12 * 60 * 60 * 1000 : 0;
            dateString = dateString.replace(" at", "").replace(/\d\d(a|p)m/, "")
            var date = Date.parse(dateString) + ampm
            conversation.push({
              sender: sender,
              date: date
            })
          } else {
            try {
              var body = thread.childNodes[i].childNodes[0].data
              conversation[conversation.length - 1].body = body
            } catch (err) {
              conversation.pop()
            }
          }
        }
        messages[other] = conversation;
      }

    })
    console.log(Object.keys(messages).length)
    res.json(messages)



    // var names = threadsArray.map(thread => thread.childNodes[0].data)

    // res.json(names)
  })
})

module.exports = router;


// > threadsArray[0].childNodes[0].data
// > Participants
// > threadsArray[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].data
// > Sender
// > threadsArray[0].childNodes[1].childNodes[0].childNodes[1].childNodes[0].data
// > Message Date
// > threadsArray[0].childNodes[2].childNodes[0].data
// > Message Body
// > threadsArray[0].childNodes[3].childNodes[0].childNodes[0].childNodes[0].data
// > Sender
// > threadsArray[0].childNodes[3].childNodes[0].childNodes[1].childNodes[0].data
// > Message Date
// > threadsArray[0].childNodes[4].childNodes[0].data
// > Message Body
