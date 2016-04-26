$.get("/data", data => {
	console.log(data)
	var counts = Object.keys(data).map(person => { return {
		name: person,
		count: data[person].length
	}})
	counts.sort((a, b) => b.count - a.count)
	var topTen = counts.slice(0,15);
	var topTenObj = {}
	topTen.forEach(entry => {
		topTenObj[entry.name] = entry.count
	})
	var chart = radialBarChart()
		.barHeight(250)
		.reverseLayerOrder(true)
		.capitalizeLabels(true)
		.barColors(['#B66199', '#9392CB', '#76D9FA', '#BCE3AD', '#FFD28C', '#F2918B'])
		.domain([0, d3.max(topTen.map(x => x.count))])

	d3.select('#gen-vis')
		.datum([{data: topTenObj}])
		.call(chart);

	var dates = Object.keys(data).map(person => { return {
		name: person,
		count: data[person].map(thread => thread.date)
	}})

	console.log(dates)
});