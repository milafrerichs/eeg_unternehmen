branchen = () ->
  width = 400
  height = 500
  radius = Math.min(width,height) /2
  outerRadius = radius - 10
  innerRadiusFinal = outerRadius * .6
  padding = 10
  
  arc = d3.svg.arc().outerRadius(outerRadius).innerRadius(radius - 70)
  
  arcFinal = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius)
  
  pie = d3.layout.pie().sort(null).value((d) -> d.Count )
  
  svg = d3.select("body")
  .append("svg")
  .attr("id","branchen")
  .attr("width", width+padding*2)
  .attr("height", height+padding*2)

  arc_group = svg.append("svg:g")
  .attr("class", "arc")
  .attr("transform", "translate(" + (width/2+padding) + "," + (height/2+padding) + ")")

  label_group = svg.append("svg:g")
  .attr("class", "label_group")
  .attr("transform", "translate(" + (width/2+padding) + "," + (height/2+padding) + ")")
    
  center_group = svg.append("svg:g")
  .attr('class', 'center_group')
  .attr("transform", "translate(" + (width/2+padding) + "," + (height/2+padding) + ")")
  
  d3.csv("/eeg/branchen_distinct.csv", (error, data) ->
    scale = d3.scale.ordinal()
    .domain([1, d3.max(data, (d) -> d.Count )])
    .range([0, 20])
    color = d3.scale.category20()
    
    g = arc_group.selectAll("path")
    .data(pie(data))
    .enter()
    label = label_group.selectAll("path")
    .data(pie(data))
    .enter()
    center = center_group.selectAll("text")
    .data(pie(data))
    .enter()
    
    g.append("path")
    .attr("d", arc)
    .style("fill", (d) -> color((d.data.Count)) )
    .on('mouseover', (d,i) ->
      d3.select($('.label_group text:eq('+i+')')[0]).style('opacity','1')
      d3.select($('.center_group text:eq('+i+')')[0]).style('opacity','1')
      d3.select(this)
      .transition()
      .duration(750)
      .attr("d", arcFinal)
      )
      .on('mouseout', (d,i) ->
        d3.select($('.label_group text:eq('+i+')')[0]).style('opacity','0')
        d3.select($('.center_group text:eq('+i+')')[0]).style('opacity','0')
        d3.select(this)
        .transition()
        .duration(750)
        .attr("d", arc)
      )
    
    center.append("text")
    .attr("transform","translate(0,-30)")
    .style("opacity", "0")
    .style("text-anchor", "middle")
    .style("font-size", "40px")
    .text( (d) -> d.data.Count )
    
    label.append("text")
    .attr("transform","translate(0,0)")
    .style("font-size", "12px")
    .style("text-anchor", "middle")
    .style("opacity", "0")
    .text( (d) -> d.data.Branche )
  )

per_bundesland = () ->
  pb_width = 400
  pb_height = 200
  pb_padding = 20
  bar_padding = 5
  svg = d3.select("body")
  .append("svg")
  .attr("id","per_bundesland")
  .attr("width", pb_width + pb_padding *2 + 50)
  .attr("height", pb_height + pb_padding * 2)
  
  balken = svg.append("svg:g")
  .attr("class", "bundesland")
  
  labels= svg.append("svg:g")
  .attr("class", "labels")
  
  colors = d3.scale.category20c()
  
  d3.csv("/eeg/per_bundesland.csv", (error, data) ->
    
    scale = d3.scale.linear()
    .domain([0, d3.max(data, (d) ->  parseInt(d.Count))])
    .range([0, pb_height ])
    
    g = balken.selectAll("path")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d,i) -> i*(pb_width /data.length) + pb_padding )
    .attr("y", (d) -> pb_height  - scale(d.Count) )
    .attr("width", pb_width / data.length - bar_padding)
    .attr("height", (d) -> scale(d.Count) )
    .attr("fill", (d,i) -> return "rgb(0, 100, " + (i * 20) + ")";)
    .on("mouseover", (d,i) ->
      d3.select($('#per_bundesland .labels text:eq('+i+')')[0]).style('opacity','1')
    )
    .on("mouseout", (d,i) ->
      d3.select($('#per_bundesland .labels text:eq('+i+')')[0]).style('opacity','0')
    )
    
    labels.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text( (d) -> d.Bundesland )
    .attr("x", (d,i) -> i*(pb_width /data.length) + pb_padding )
    .attr("y", pb_height + pb_padding)
    .style("opacity", 0)
    .style("text-anchor", "start")
    
  )  
$ ->
  branchen()
  per_bundesland()  
  