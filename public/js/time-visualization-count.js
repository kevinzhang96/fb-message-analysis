TimeVisualization = function(_parentElement, _data) {

	this.parentElement = _parentElement;
	this.data = _data;
	this.initVis();
}

TimeVisualization.prototype.initVis = function(){
	var vis = this;

	vis.margin = {top: 40, right: 40, bottom: 60, left: 60};

	vis.width = 600 - vis.margin.left - vis.margin.right;
	vis.height = 500 - vis.margin.top - vis.margin.bottom;

	vis.svg = d3.select("#"+vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom);
	vis.graph = vis.svg.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");
	vis.lineGraph = vis.graph.append('g');
	vis.path = vis.lineGraph.append('path').attr('class', 'line');

	vis.x = d3.time.scale()
		.range([0, vis.width]);

	vis.y = d3.scale.linear()
		.range([vis.height,0]);
	vis.yAxis = d3.svg.axis()
		.scale(vis.y)
		.orient("left");
	vis.xAxis = d3.svg.axis()
		.scale(vis.x)
		.orient("bottom");

	vis.yAxisGroup = vis.graph.append("g")
		.attr("class", "y-axis axis");

	vis.xAxisGroup = vis.graph.append("g")
		.attr("class", "x-axis axis");

	/* Initialize tooltip */
	vis.tip = vis.lineGraph.append('text')
		.attr('id','tooltip')
		.attr('display', 'none')
		.attr('z-index', 10000);

	vis.formatDate = d3.time.format("%Y");
}

// Render visualization
TimeVisualization.prototype.updateVisualization = function(color) {
	var vis = this;
	vis.x.domain(d3.extent(this.data, function(d){ return d.date}));
	vis.y.domain(d3.extent(this.data, function(d){ return d.count}));
	var line = d3.svg.line()
		.x(function(d){ return vis.x(d.date); })
		.y(function(d){ return vis.y(d.count); });

	vis.graph.select('.x-axis').transition().duration(800).call(vis.xAxis);
	vis.graph.select('.y-axis').transition().duration(800).call(vis.yAxis);

	vis.path.datum(this.data)
		.transition()
		.duration(800)
		.attr('d', line)
		.attr('fill','none')
		.attr('stroke',color)

	var circles = vis.lineGraph.selectAll('circle')
		.data(this.data);

	circles.enter()
		.append('circle');

	circles
		.transition()
		.duration(800)
		.attr('r', 7)
		.attr('cy', function(d){ return vis.y(d.count); })
		.attr('cx', function(d){ return vis.x(d.date); })
		.attr('fill', color)
		.attr('stroke', color);

	circles.exit().remove();

	d3.select('.x-axis')
		.attr('transform', 'translate(0,'+(vis.height+15)+')');

	d3.select('.y-axis')
		.attr('transform', 'translate(-15,0)');

}

TimeVisualization.prototype.setData = function(d)
{
	this.data = d;
}
