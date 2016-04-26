$.get("/data", function(data) {
  var counts = Object.keys(data).map(function(person) {
    return {
      name: person,
      count: data[person].length > 1000 ?
        data[person].filter(function(message) { 
          return message.sender === person
        }).length / data[person].length 
        : -1000,
      times: data[person].map(function(message) { return new Date(message.date); }),
      people: data[person].map(function(d) { return d.sender === person; })
    }
  });
  counts.sort(function(a, b) {return b.count - a.count});
  var topTen = counts.slice(0,10);
  var topTenObj = {};
  topTen.forEach(function(entry) {
    topTenObj[entry.name] = {
      count: entry.count,
      times: entry.times,
      people: entry.people
    }
  });
  
  function countsFunc(d) {
		var array = []
		for(var j = 0; j<10; j++)
		{
			var t = (d.times).map(function(x){ return x.getTime() });
      var counts = 0;
      var total = 0;
      for (var i = 0; i < t.length; i++) {
        if (j < 9) {
          if ((t[i] > timeArray[j]) && (t[i] < timeArray[j+1])) {
            total += 1;
            if (d.people[i]) {
              counts += 1;
            }
          }
        } else {
          if (t[i] > timeArray[j]) {
            total += 1;
            if (d.people[i]) {
              counts += 1;
            }
          }
        }
      }
			array.push(counts / total);
		}
		return array;
	}
  
  var chart = radialBarChart('ratios-time-line', countsFunc)
    .barHeight(250)
    .reverseLayerOrder(true)
    .capitalizeLabels(true)
    .barColors(['#B66199', '#9392CB', '#76D9FA', '#BCE3AD', '#FFD28C', '#F2918B'])
    .domain([0, d3.max(topTen.map(function(x) {return x.count}))]);
  d3.select('#ratios-vis')
    .datum([{data: topTenObj}])
    .call(chart);
});