var express = require('express');
var router = express.Router();

var fs = require('fs'),
  path = require('path')
cheerio = require('cheerio')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/process', (req, res) => {

  // Parses data/sample.htm

  fs.readFile(path.join("data", "sample.htm"), 'utf8', (err, data) => {
    if (err) {
      console.error("error reading")
      return;
    }

    // Read file into an array of threads

    var messageData = cheerio.load(data)
    var threads = messageData(".thread")
    var threadsArray = [];
    threads.each((i, thread) => {
      threadsArray.push(thread);
    });

    // Guess the user's name by finding the first name with 5 appearances in the
    // first 10 conversations.
    var userName = null,
      tempNames = {};
    var firstTenConvos = threadsArray.slice(0, 10)
    while (!userName) {
      var convo = firstTenConvos.pop();
      if(convo !== undefined) {
        var names = convo.childNodes[0].data.split(",");
        if (names.length == 2) {
          names.forEach(name => {
            if (tempNames[name] == undefined) tempNames[name] = 0;
            else {
              tempNames[name]++;
              if (tempNames[name] >= 5) userName = name;
            }
          })
        }
      }

    }

    // Create associative array by friend

    var messages = {}
    threadsArray.forEach(thread => {
      var participants = thread.childNodes[0].data
      if (participants !== undefined && participants.split(",").length == 2) {
        // The other person's name
        var other = participants.replace(userName, "").replace(",", "").trim()
        var conversation = []
        for (var i = 1; i < thread.childNodes.length; i++) {
          if (i % 2 == 1) {
            // Odd-numbered children are sender and date information
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
            // Even-numbered children may contain a message body (might be empty due to image, emoji)
            try {
              var body = thread.childNodes[i].childNodes[0].data
              conversation[conversation.length - 1].body = body
            } catch (err) {
              conversation.pop()
            }
          }
        }
        conversation.sort((a, b) => b.date - a.date)
        messages[other] = [...(messages[other] || []), ...conversation];
      }
    })
    res.end(JSON.stringify(messages, null, 2))
  })
})

router.get('/test', (req, res) => {
  fs.readFile("data/test.json", 'utf8', (err, data) => {
    res.json(JSON.parse(data))
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
