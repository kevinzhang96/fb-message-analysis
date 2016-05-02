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
	
	//svg.call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom))
	var bubble = d3.layout.pack()
		.sort(null)
		.size([diameter, diameter])
		.padding(4)
		.value(function(d){ return d.count; })
		
//	d3.json(countsJSON, function(error, data){
	var nodes = bubble.nodes({children: counts}).slice(1);
//	console.log(nodes);
	var bubbles = svg.append("g")
		.attr("transform", "translate(0,0)")
		.selectAll(".bubble")
		.data(nodes)
		.enter();
	
	var circles = bubbles.append("circle")
        .attr("r", function(d){ return d.r; })
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .style("fill", function(d) { 
			var val = colorScale(d.first);
			var col = 'rgb('+val+','+val+',160)';
			console.log(col);
			return col;
		})
		.attr('stroke','blue')
		.attr('stroke-width',3.5)
	circles
		.on('mouseover', function(d){
			d3.select(this).transition().duration(500).attr('stroke', 'green');
			$('#name').text(d.name);
			$('#message-count').text(d.count);
			$('#first').text(function(){
				var date = new Date(d.first);
				var dateText = date.toString().slice(0,15)
				return dateText;
			})
		})
		.on('mouseout', function(){
			d3.select(this).transition().duration(500).attr('stroke', 'blue');
		})
	//})
/*
function zoom(){
	svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
*/
};