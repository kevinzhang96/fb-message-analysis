var instance; 

class CountsBarChart {
  constructor (_parentElement, _rankingSelectID, _data) {
    this.parentElement = _parentElement;
    this.selectID = _rankingSelectID;
    this.data = _data;
    
    this.animateTime = 1000;
    this.margin = {top: 40, right: 10, bottom: 60, left: 60};
    
    var margin = this.margin;
    this.width = 960 - margin.left - margin.right;
    this.height = 500 - margin.top - margin.bottom;
    
    this.reversed = false;
    
    this.loadData();
  }
  
  loadData() {
    this.initializeVisualization();
    this.updateBars();
  }
  
  initializeVisualization() {
    var margin = this.margin
    
    // create svg
    this.svg = d3.select(this.parentElement).append("svg")
        .attr("width", this.width + margin.left + margin.right)
        .attr("height", this.height + margin.top + margin.bottom)
      .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // scales
    this.x = d3.scale.ordinal().rangeRoundBands([0, this.width], .1);
    this.y = d3.scale.linear().range([this.height, 0]);
    
    // axes and labels
    this.xAxis = d3.svg.axis()
      .orient("bottom")
      .scale(this.x);
    this.yAxis = d3.svg.axis()
      .orient("left")
      .scale(this.y);
    this.svg.append("text")
      .attr("id", "y-axis-label")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle")
      .attr("x", -margin.left / 2)
      .attr("y", -margin.top / 2);
    this.svg.append("g")
      .attr("class", "x-axis axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.xAxis);
    this.svg.append("g")
      .attr("class", "y-axis axis")
      .call(this.yAxis);
  }
  
  updateBars() {
    var viz = this;
    
    // check values
    var isStores = (d3.select(viz.selectID).property("value") == "stores");
    
    // function to return correct value for a data point
    function valFor(d) { return isStores ? d.stores : d.revenue; };
    
    // get values array and sort data
    var values = viz.data.map(function(d) { return valFor(d); });
    var sortedData = viz.data.sort(function(d1, d2) { 
      return (viz.reversed ? -1 : 1) * (valFor(d2) - valFor(d1));
    });
    
    // min and max of values
    var valueMin = d3.min(values);
    var valueMax = d3.max(values);
    
    // reset axes
    var companies = sortedData.map(function(d) { return d.company; });
    viz.x.domain(companies);
    viz.y.domain([0, valueMax]);
    
    // update axis labels
    viz.svg.select(".axis-label").text(isStores ? "Stores" : "Revenue");
    viz.svg.select("g.x-axis").transition().duration(0.5 * viz.animateTime).call(viz.xAxis);
    viz.svg.select("g.y-axis").transition().duration(0.5 * viz.animateTime).call(viz.yAxis);
    
    // update bars
    var bars = viz.svg.selectAll(".bar").data(sortedData);
    bars.exit().remove();
    bars.enter()
      .append("rect")
        .attr("fill", "black")
        .attr("class", "bar");
    bars
        .transition()
        .duration(viz.animateTime)
        .attr("width", function(d, i) { return viz.x.rangeBand(); })
        .attr("height", function(d) { return viz.height - viz.y(valFor(d)); })
        .attr("x", function(d, i) { return viz.x(d.company); })
        .attr("y", function(d) { return viz.y(valFor(d)); });
  }
}

function reverse() {
  instance.reversed = !instance.reversed;
  instance.updateBars();
}

d3.csv("data/coffee-house-chains.csv", function(error, csv) {
  instance = new CountsBarChart("#chart-area", "#ranking-type", csv);
});