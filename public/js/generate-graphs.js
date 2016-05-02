$.get("/data", function(data) {
  generateDateLineGraph(data);
  generateCountsRadialGraph(data);
  generateRatiosRadialGraph(data);
  generateLengthRadialGraph(data);
  generateFriendBubbles(data);
});