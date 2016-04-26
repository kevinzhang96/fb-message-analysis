function generateLengthRadialGraph(data) {
  var counts = Object.keys(data).map(function(person) { return {
    name: person,
    count: data[person].length > 500 ? data[person].map(function(message) {return  message.body}).reduce(function(a, b) { return ""+a+b}, 0).length / data[person].length : 0,
    times: data[person].map(function(message) { return new Date(message.date); }),
    lengths: data[person].map(function(message) { return message.body.length; })
  }})
  counts.sort(function(a, b) { return  b.count - a.count})
  var topTen = counts.slice(0,10);
  var topTenObj = {}
  topTen.forEach(function(entry) {
    topTenObj[entry.name] = {
      count: entry.count,
      times: entry.times,
      lengths: entry.lengths
    }
  })
  
  function countsFunc(d) {
    var array = []
    for (var j = 0; j < 10; j++) {
      var t = (d.times).map(function(x) { return x.getTime()});
      var total = 0;
      var n = 0;
      for (var i = 0; i < t.length; i++) {
        if (j < 9) {
          if ((t[i] > timeArray[j]) && (t[i] < timeArray[j+1])) {
            n += 1;
            total += d.lengths[i];
          }
        } else {
          if (t[i] > timeArray[j]) {
            n += 1;
            total += d.lengths[i];
          }
        }
      }
      array.push(total / n);
    }
    return array;
  }
  
  var chart = radialBarChart('lengths-time-line', countsFunc)
    .barHeight(250)
    .reverseLayerOrder(true)
    .capitalizeLabels(true)
    .barColors(['#B66199', '#9392CB', '#76D9FA', '#BCE3AD', '#FFD28C', '#F2918B'])
    .domain([0, d3.max(topTen.map(function(x) {return x.count}))])
  d3.select('#lengths-vis')
    .datum([{data: topTenObj}])
    .call(chart);
};