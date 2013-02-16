
$ ->
  
  $(document).ready(function() { var width = 960,
      height = 500,
      radius = Math.min(width, height) / 2;

  var color = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 70);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.Freq; });

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  d3.csv("branchen.csv", function(error, data) {

  
    var g = svg.selectAll(".arc")
        .data(pie(data))
      .enter().append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.Freq); })
        .on('mouseover', function(d,i) { d3.select(this.nextSibling).style('opacity','1'); })
        .on('mouseout', function(d,i){ d3.select(this.nextSibling).style('opacity','0'); });

    g.append("text")
        .attr("transform", function(d) { console.log(arc.centroid(d)); return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", "0")
        .style("text-anchor", "start")
        .style("opacity", "0")
        .text(function(d) { return d.data.Var1; });

  });
  });
  