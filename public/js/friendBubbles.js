function generateFriendBubbles(data) {
	
	var counts = Object.keys(data).map(function(person) { return {
		name: person,
		count: data[person].length,
		times: (data[person].map(function(message) { return message.date; }))
	}})
	counts.forEach(function(entry){
		entry.first = (entry.times)[(entry.times).length-1];
	})
	// convert to json as a test for this stupid nodes thing
	console.log(counts);

	var element = 'BUBBLE-VIS';
	
	var height = $('#'+element).height();
	var width = $('#'+element).width();
	var diameter = 750;
	var firsts = counts.map(function(d){ return d.first });
	
	var colorScale = d3.scale.linear()
		.domain(d3.extent(firsts))
		.range([50,160]);
	
	var svg = d3.select('#'+element)
		.append('svg')
		.attr('id','bubble-chart')
		.style('width', width)
		.style('height', height);
	
	var bubble = d3.layout.pack()
		.sort(null)
		.size([diameter, diameter])
		.padding(1.5)
		.value(function(d){ return d.count; })
		
//	d3.json(countsJSON, function(error, data){
	var nodes = bubble.nodes({children: counts});
//	console.log(nodes);
	var bubbles = svg.append("g")
		.attr("transform", "translate(0,0)")
		.selectAll(".bubble")
		.data(nodes)
		.enter();
		
	bubbles.append("circle")
        .attr("r", function(d){ return d.r; })
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .style("fill", function(d) { 
			var val = colorScale(d.first);
			return 'rgb('+d.first+','+d.first+',160)';
		});
	//})


};