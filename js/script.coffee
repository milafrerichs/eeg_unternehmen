bundeslaender = []
bundeslaender_abkuerzungen = (bundesland) ->
  abkuerzung = switch bundesland
    when "Baden-Württemberg" then "BW"
    when "Bayern" then "BY"
    when "Berlin" then "B"
    when "Brandenburg" then "BB"
    when "Bremen" then "HB"
    when "Hamburg" then "HH"
    when "Hessen" then "H"
    when "Mecklenburg-Vorpommern" then "MV"
    when "Niedersachsen" then "N"
    when "Nordrhein-Westfalen" then "NRW"
    when "Rheinland-Pfalz" then "RP"
    when "Saarland" then "SR"
    when "Sachsen" then "S"
    when "Sachsen-Anhalt" then "SA"
    when "Schleswig-Holstein" then "SW"
    when "Thüringen" then "T"
  abkuerzung
  

bundesland_branchen = (branche) ->
  svg = d3.select("svg#per_bundesland")
  balken = svg.select('g.bundesland')
  pb_height = 200
  pb_padding = 50
  d3.csv("/eeg/branche_bundesland.csv", (error, data) ->
    
    bundeslaender_branchen = d3.map(data)
    branche_bundeslaender = []
    bundeslaender_branchen.forEach((key, value) -> 
      if(value.branche == branche)
        branche_bundeslaender[value.bundesland] =  value.Count
    )
    for bundesland in bundeslaender
       bundesland.count = if branche_bundeslaender[bundesland.bundesland] then branche_bundeslaender[bundesland.bundesland] else 0
    
    scale = d3.scale.linear()
    .domain([0, d3.max(bundeslaender, (d) ->  parseInt(d.count))])
    .range([0, pb_height - pb_padding ])
    
    y_scale = d3.scale.linear()
    .domain([0,d3.max(bundeslaender, (d) ->  parseInt(d.count))])
    .range([pb_height - pb_padding,0 ])
    
    y_axis = d3.svg.axis().scale(y_scale).orient("right").ticks(5)
    
    svg.select(".y.axis")
            .transition()
            .duration(1000)
            .call(y_axis);
    
    balken.selectAll("rect")
    .data(bundeslaender)
    .transition()
    .duration(750)
    .attr("height", (d) -> scale(d.count) )
    .attr("y", (d) -> pb_height  - scale(d.count) )
  )
  

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
      
      bundesland_branchen(d.data.Branche)
      
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
  pb_width = 600
  pb_height = 200
  pb_padding = 50
  bar_padding = 10
  svg = d3.select("body")
  .append("svg")
  .attr("id","per_bundesland")
  .attr("width", pb_width + pb_padding *2 + 50)
  .attr("height", pb_height + pb_padding * 2+ 90)
  
  balken = svg.append("svg:g")
  .attr("class", "bundesland")
  
  labels= svg.append("svg:g")
  .attr("class", "labels")
  
  colors = d3.scale.category20c()
  
  d3.csv("/eeg/per_bundesland.csv", (error, data) ->
    
    scale = d3.scale.linear()
    .domain([0, d3.max(data, (d) ->  parseInt(d.Count))])
    .range([0, pb_height- pb_padding ])
    
    y_scale = d3.scale.linear()
    .domain([0,d3.max(data, (d) ->  parseInt(d.Count))])
    .range([pb_height - pb_padding,0 ])
    
    g = balken.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d,i) -> i*(pb_width /data.length) + pb_padding )
    .attr("y", (d) -> pb_height  - scale(d.Count) )
    .attr("width", pb_width / data.length - bar_padding)
    .attr("height", (d) -> scale(d.Count) )
    .attr("fill", (d,i) -> "rgb(0, " + (155 - i*10) + ", " + (255 - i*10) + ")")
    .on("mouseover", (d,i) ->
      
    )
    .on("mouseout", (d,i) ->
      
    )
    
    labels.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text( (d) -> bundeslaender_abkuerzungen(d.Bundesland) )
    .attr("x", (d,i) -> i*(pb_width /data.length) + pb_padding + bar_padding + 5 )
    .attr("y", pb_height + 20)
    .style("text-anchor", "middle")
    
    yAxis = d3.svg.axis().scale(y_scale).orient("right").ticks(5)
    xAxis = d3.svg.axis()
            .scale(d3.scale.linear().domain([1,16]).range([1,pb_width+pb_padding]))
                          .orient("bottom")
                          .tickValues(["","","","","","","","","","","","","","","",""]);
    svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (pb_height  ) + ")")
            .call(xAxis)
    svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (pb_width + pb_padding ) + "," + pb_padding + ")")
            .call(yAxis)
  )  
$ ->
  d3.csv("/eeg/per_bundesland.csv", (error, data) ->
    bundeslaender = ({bundesland: entry.Bundesland, count:0 } for entry in data)
    
  )
  branchen()
  per_bundesland()  
  