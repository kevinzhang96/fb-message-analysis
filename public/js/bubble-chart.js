function bubbleChart(element, data){
	
	var height = $('#'+element).height();
	var width = $('#'+element).width();
	var diameter = 200;
	
	var colorScale = d3.scaleLinear()
		.domain(d3.extent(data))
		.range([50,160]);
	
	var svg = d3.select(element)
		.append('svg')
		.attr('id','bubble-chart')
		.style('width', width)
		.style('height', height);
	
	var bubble = d3.layout.pack()
		.sort(null)
		.size([diameter, diameter])
		.padding(1.5);
	
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
			var val = colorScale(d.value);
			return 'rgb('+val+','+val+',160)';
			});
	
	
}