$.get("/data", function(data) {
	var counts = Object.keys(data).map(function(person) { return {
		name: person,
		count: data[person].length,
		times: data[person].map(function(message) { return new Date(message.date); })
	}})
	counts.sort(function(a, b) { return  b.count - a.count})
	var topTen = counts.slice(0,10);
	var topTenObj = {}
	topTen.forEach(function(entry) {
		topTenObj[entry.name] = {
			count: entry.count,
			times: entry.times
		}
	});

	var chart = radialBarChart()
		.barHeight(250)
		.reverseLayerOrder(true)
		.capitalizeLabels(true)
		.barColors(['#B66199', '#9392CB', '#76D9FA', '#BCE3AD', '#FFD28C', '#F2918B'])
		.domain([0, d3.max(topTen.map(function(x) { return x.count}))])
	d3.select('#count-radial-vis')
		.datum([{data: topTenObj}])
		.call(chart);
})