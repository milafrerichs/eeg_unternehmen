function textPosition(arcCenter) {
  var arcCenterX = arcCenter[0];
  var arcCenterY = arcCenter[1];

   var rotatedRadians = Math.atan2(-arcCenterX,-arcCenterY);
   rotatedDegrees = rotatedRadians * (180 / Math.PI);
   
   var d3_svg_arcOffset = -Math.PI / 2;
   var radians = rotatedDegrees * (Math.PI / 180);
   
   var points = [ Math.cos(radians) * 210, Math.sin(radians) * 210 ];
   
   
   return points;
}

var w = 960;
var h = 500;
var r = Math.min(w, h) / 2;
var ir = r-70;
var textOffset = 14;
var tweenDuration = 250;


$(document).ready(function() { var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2,
    outerRadius = radius -10,
    innerRadiusFinal = outerRadius * .5,
    innerRadiusFinal3 = outerRadius* .45;
    padding = 100;


var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);
    
var arcFinal = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
var arcFinal3 = d3.svg.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.Count; });

var svg = d3.select("body").append("svg")
    .attr("width", width+padding*2)
    .attr("height", height+padding*2)
  
   //GROUP FOR ARCS/PATHS
    var arc_group = svg.append("svg:g")
      .attr("class", "arc")
      .attr("transform", "translate(" + (width/2+padding) + "," + (height/2+padding) + ")");

    //GROUP FOR LABELS
    var label_group = svg.append("svg:g")
      .attr("class", "label_group")
      .attr("transform", "translate(" + (width/2+padding) + "," + (height/2+padding) + ")");
    
      var count_group = svg.append("svg:g")
      .attr('class', 'count_group')
      .attr("transform", "translate(" + (width/2+padding) + "," + (height/2+padding) + ")");

d3.csv("/eeg/branchen_distinct.csv", function(error, data) {

  var scale = d3.scale.ordinal()
                         .domain([1, d3.max(data, function(d) { return d.Count; })])
.range([0, 20]);
  var color = d3.scale.category20();
  
  var g = arc_group.selectAll("path")
      .data(pie(data))
    .enter();
  var label = label_group.selectAll("path").data(pie(data)).enter();
  var counts = count_group.selectAll("text").data(pie(data)).enter();  
  
  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color((d.data.Count)) })
      .on('mouseover', function(d,i) { 
        d3.select($('.label_group text:eq('+i+')')[0]).style('opacity','1'); 
        d3.select(this).select("path").transition().duration(750).attr("d", arcFinal3);
      })
      .on('mouseout', function(d,i){ 
        d3.select($('.label_group text:eq('+i+')')[0]).style('opacity','0'); 
        d3.select(this).select("path").transition().duration(750).attr("d", arcFinal);
      });
  
  counts.append("text")
      .attr("transform",function(d) { return "translate("+arc.centroid(d)+")"})
      .style("opacity", "0")
      .text(function(d) {  return d.data.Count });
      

 label.append("text")
      .attr("transform", function(d) { ; return "translate(" + Math.cos(((d.startAngle+d.endAngle - Math.PI)/2)) * (250) + "," + Math.sin((d.startAngle+d.endAngle - Math.PI)/2) * (250) + ")"; })
      .attr("dy", "5")
      .style("text-anchor", function(d){
        if ((d.startAngle+d.endAngle)/2 < Math.PI ) {
          return "beginning";
        } else {
          return "end";
        }
      })
      .style("opacity", "0")
      .text(function(d) { return d.data.Branche; });

});
});