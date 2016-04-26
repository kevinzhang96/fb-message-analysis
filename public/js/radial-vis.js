// $.get("/data", data => {
// 	var counts = Object.keys(data).map(person => { return {
// 		name: person,
// 		count: data[person].length
// 	}})
// 	counts.sort((a, b) => b.count - a.count)
// 	var topTen = counts.slice(0,15);
// 	var topTenObj = {}
// 	topTen.forEach(entry => {
// 		topTenObj[entry.name] = entry.count
// 	})
// 	var chart = radialBarChart()
// 		.barHeight(250)
// 		.reverseLayerOrder(true)
// 		.capitalizeLabels(true)
// 		.barColors(['#B66199', '#9392CB', '#76D9FA', '#BCE3AD', '#FFD28C', '#F2918B'])
// 		.domain([0, d3.max(topTen.map(x => x.count))])

// 	d3.select('#gen-vis')
// 		.datum([{data: topTenObj}])
// 		.call(chart);

// 	var dates = Object.keys(data).map(person => { return {
// 		name: person,
// 		count: data[person].map(thread => thread.date)
// 	}})

// 	console.log(dates)
// });

date = null;
$.get("/data", function(data) {
	var counts = Object.keys(data).map(function(person) { return {
		name: person,
		count: data[person].length,
		times: data[person].map(function(message) { return new Date(message.date); })
	}})

	counts.sort(function(a, b) { return  b.count - a.count})
	var topTen = counts.slice(0,15);
	var topTenObj = {}
	topTen.forEach(function(entry) {
		topTenObj[entry.name] = {
			count: entry.count,
			times: entry.times
		}

	})
	console.log(topTenObj)
	
	var chart = radialBarChart()
		.barHeight(250)
		.reverseLayerOrder(true)
		.capitalizeLabels(true)
		.barColors(['#B66199', '#9392CB', '#76D9FA', '#BCE3AD', '#FFD28C', '#F2918B'])
		.domain([0, d3.max(topTen.map(function(x) { return  x.count}))])
	date = topTenObj;
	d3.select('#count-radial-vis')
		.datum([{data: topTenObj}])
		.call(chart);
})