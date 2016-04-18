// Stored variables
var animateTime = 1000;
var margin = {top: 40, right: 10, bottom: 60, left: 60};
var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var svg, x, y;
var xAxis, yAxis;
var data;
var reversed = false;

class CountsBarChart {
  constructor (_parentElement, _data) {
    this.parentElement = _parentElement
    this.data = _data; 
  }
}

// Load CSV file
function loadData() {
  // Using example coffee house data for now
	d3.csv("data/coffee-house-chains.csv", function(error, csv) {
		csv.forEach(function(d){
			d.revenue = +d.revenue;
			d.stores = +d.stores;
		});

		// Store csv data in global variable
		data = csv;

    // Draw the visualization for the first time
		initializeVisualization();
    updateBars();
	});
};
loadData();

// Render visualization
function initializeVisualization() {
  // initialize SVG
  svg = d3.select("#chart-area").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  // initialize scales
  x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
  y = d3.scale.linear().range([height, 0]);
  
  // initialize axes and labels
  xAxis = d3.svg.axis()
    .orient("bottom")
    .scale(x);
  yAxis = d3.svg.axis()
    .orient("left")
    .scale(y);
  svg.append("text")
    .attr("id", "y-axis-label")
    .attr("class", "axis-label")
    .attr("text-anchor", "middle")
    .attr("x", -margin.left / 2)
    .attr("y", -margin.top / 2);
  
  // append axes
  svg.append("g")
    .attr("class", "x-axis axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  svg.append("g")
    .attr("class", "y-axis axis")
    .call(yAxis);
}

function updateBars() {
  // check values
  var isStores = (d3.select("#ranking-type").property("value") == "stores");
  
  // function to return correct value for a data point
  function valFor(d) { return isStores ? d.stores : d.revenue; };
  
  // get values array and sort data
  var values = data.map(function(d) { return valFor(d); });
  var sortedData = data.sort(function(d1, d2) { return (reversed ? -1 : 1) * (valFor(d2) - valFor(d1)); });
  console.log(reversed);
  console.log(sortedData);
  
  // min and max of values
  var valueMin = d3.min(values);
  var valueMax = d3.max(values);
 
  // reset axes
  var companies = sortedData.map(function(d) { return d.company; });
  x.domain(companies);
  y.domain([0, valueMax]);
  
  // update axis labels
  svg.select(".axis-label").text(isStores ? "Stores" : "Revenue");
  svg.select("g.x-axis").transition().duration(0.5 * animateTime).call(xAxis);
  svg.select("g.y-axis").transition().duration(0.5 * animateTime).call(yAxis);
  
  // update bars
  var bars = svg.selectAll(".bar").data(sortedData);
  bars.exit().remove();
  bars.enter()
    .append("rect")
      .attr("fill", "black")
      .attr("class", "bar");
  bars
    .transition()
    .duration(animateTime)
    .attr("width", function(d, i) { return x.rangeBand(); })
    .attr("height", function(d) { return height - y(valFor(d)); })
    .attr("x", function(d, i) { return x(d.company); })
    .attr("y", function(d) { return y(valFor(d)); });
}

function reverse() {
  reversed = !reversed;
  updateBars();
}