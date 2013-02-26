(function() {
  var branchen, branchen_colors, bundeslaender, bundeslaender_abkuerzungen, bundeslaender_colors, bundesland_branchen, gesamt, per_bundesland, top_20_unternehmen;

  bundeslaender = [];

  bundeslaender_colors = ["#D47B8C", "#6EB042", "#9067D9", "#729FC6", "#CA9839", "#D44B33", "#50A58B", "#87397E", "#516830", "#515572", "#D54ED1", "#D83F7D", "#873840", "#C786C8", "#9E6133", "#5B70C3"];

  branchen_colors = ["#559437", "#DE7DCC", "#E08131", "#69D0D5", "#D25D69", "#D8E43D", "#BAAA96", "#6E6E9B", "#498F6C", "#8A7F2B", "#62DEAC", "#D8AED0", "#63DC71", "#A7707E", "#D4CE89", "#5F8083", "#8DDE3F", "#6EA7D6", "#E4B03D", "#8E6950", "#A38DD9", "#AED9B1", "#E09F7C", "#C9D5D7", "#C76190", "#A8DA7A", "#6F834C", "#A56A2A", "#CE6047", "#C2C249"];

  bundeslaender_abkuerzungen = function(bundesland) {
    var abkuerzung;
    abkuerzung = (function() {
      switch (bundesland) {
        case "Baden-Württemberg":
          return "BW";
        case "Bayern":
          return "BY";
        case "Berlin":
          return "B";
        case "Brandenburg":
          return "BB";
        case "Bremen":
          return "HB";
        case "Hamburg":
          return "HH";
        case "Hessen":
          return "H";
        case "Mecklenburg-Vorpommern":
          return "MV";
        case "Niedersachsen":
          return "N";
        case "Nordrhein-Westfalen":
          return "NRW";
        case "Rheinland-Pfalz":
          return "RP";
        case "Saarland":
          return "SR";
        case "Sachsen":
          return "S";
        case "Sachsen-Anhalt":
          return "SA";
        case "Schleswig-Holstein":
          return "SW";
        case "Thüringen":
          return "T";
      }
    })();
    return abkuerzung;
  };

  bundesland_branchen = function(branche) {
    var balken, pb_height, pb_padding, svg;
    svg = d3.select("svg#per_bundesland");
    balken = svg.select('g.bundesland');
    pb_height = 200;
    pb_padding = 50;
    return d3.csv("/eeg_unternehmen/branche_bundesland.csv", function(error, data) {
      var branche_bundeslaender, bundeslaender_branchen, bundesland, scale, y_axis, y_scale, _i, _len;
      bundeslaender_branchen = d3.map(data);
      branche_bundeslaender = [];
      bundeslaender_branchen.forEach(function(key, value) {
        if (value.branche === branche) {
          return branche_bundeslaender[value.bundesland] = value.Count;
        }
      });
      for (_i = 0, _len = bundeslaender.length; _i < _len; _i++) {
        bundesland = bundeslaender[_i];
        bundesland.count = branche_bundeslaender[bundesland.bundesland] ? branche_bundeslaender[bundesland.bundesland] : 0;
      }
      scale = d3.scale.linear().domain([
        0, d3.max(bundeslaender, function(d) {
          return parseInt(d.count);
        })
      ]).range([0, pb_height - pb_padding]);
      y_scale = d3.scale.linear().domain([
        0, d3.max(bundeslaender, function(d) {
          return parseInt(d.count);
        })
      ]).range([pb_height - pb_padding, 0]);
      y_axis = d3.svg.axis().scale(y_scale).orient("right").ticks(5);
      svg.select(".y.axis").transition().duration(1000).call(y_axis);
      return balken.selectAll("rect").data(bundeslaender).transition().duration(750).attr("height", function(d) {
        return scale(d.count);
      }).attr("y", function(d) {
        return pb_height - scale(d.count);
      });
    });
  };

  branchen = function() {
    var arc, arcFinal, arc_group, center_group, height, innerRadiusFinal, label_group, outerRadius, padding, pie, radius, svg, width;
    width = 400;
    height = 500;
    radius = Math.min(width, height) / 2;
    outerRadius = radius - 10;
    innerRadiusFinal = outerRadius * .6;
    padding = 10;
    arc = d3.svg.arc().outerRadius(outerRadius).innerRadius(radius - 70);
    arcFinal = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
    pie = d3.layout.pie().sort(null).value(function(d) {
      return d.Count;
    });
    svg = d3.select("#branchen_container").append("svg").attr("id", "branchen").attr("width", width + padding * 2).attr("height", height + padding * 2);
    arc_group = svg.append("svg:g").attr("class", "arc").attr("transform", "translate(" + (width / 2 + padding) + "," + (height / 2 + padding) + ")");
    label_group = svg.append("svg:g").attr("class", "label_group").attr("transform", "translate(" + (width / 2 + padding) + "," + (height / 2 + padding) + ")");
    center_group = svg.append("svg:g").attr('class', 'center_group').attr("transform", "translate(" + (width / 2 + padding) + "," + (height / 2 + padding) + ")");
    return d3.csv("/eeg_unternehmen/branchen_distinct.csv", function(error, data) {
      var center, color, g, label, scale;
      scale = d3.scale.ordinal().domain([
        1, d3.max(data, function(d) {
          return d.Count;
        })
      ]).range([0, 20]);
      color = d3.scale.ordinal().range(branchen_colors);
      g = arc_group.selectAll("path").data(pie(data)).enter();
      label = label_group.selectAll("path").data(pie(data)).enter();
      center = center_group.selectAll("text").data(pie(data)).enter();
      g.append("path").attr("d", arc).style("fill", function(d) {
        return color(d.data.Count);
      }).on('mouseover', function(d, i) {
        d3.select($('.center_group text:eq(' + i + ')')[0]).style('opacity', '1');
        $('#bundeslaender_branche').text(d.data.Branche);
        d3.select(this).transition().duration(750).attr("d", arcFinal);
        return bundesland_branchen(d.data.Branche);
      }).on('mouseout', function(d, i) {
        d3.select($('.center_group text:eq(' + i + ')')[0]).style('opacity', '0');
        return d3.select(this).transition().duration(750).attr("d", arc);
      });
      center.append("text").attr("transform", "translate(0,-30)").style("opacity", "0").style("text-anchor", "middle").style("font-size", "40px").text(function(d) {
        return d.data.Count;
      });
      return label.append("text").attr("transform", "translate(0,0)").style("font-size", "12px").style("text-anchor", "middle").style("opacity", "0").text(function(d) {
        return d.data.Branche;
      });
    });
  };

  per_bundesland = function() {
    var balken, bar_padding, colors, labels, pb_height, pb_padding, pb_width, svg;
    pb_width = 600;
    pb_height = 200;
    pb_padding = 50;
    bar_padding = 10;
    svg = d3.select("#bundeslaender_container").append("svg").attr("id", "per_bundesland").attr("width", pb_width + pb_padding * 2 + 50).attr("height", pb_height + pb_padding * 2 + 90);
    balken = svg.append("svg:g").attr("class", "bundesland");
    labels = svg.append("svg:g").attr("class", "labels");
    colors = d3.scale.ordinal().domain(bundeslaender).range(bundeslaender_colors);
    return d3.csv("/eeg_unternehmen/per_bundesland.csv", function(error, data) {
      var g, scale, xAxis, yAxis, y_scale;
      scale = d3.scale.linear().domain([
        0, d3.max(data, function(d) {
          return parseInt(d.Count);
        })
      ]).range([0, pb_height - pb_padding]);
      y_scale = d3.scale.linear().domain([
        0, d3.max(data, function(d) {
          return parseInt(d.Count);
        })
      ]).range([pb_height - pb_padding, 0]);
      g = balken.selectAll("rect").data(data).enter().append("rect").attr("x", function(d, i) {
        return i * (pb_width / data.length) + pb_padding;
      }).attr("y", function(d) {
        return pb_height - scale(d.Count);
      }).attr("width", pb_width / data.length - bar_padding).attr("height", function(d) {
        return scale(d.Count);
      }).attr("fill", function(d, i) {
        return colors(d.Bundesland);
      }).on("mouseover", function(d, i) {}).on("mouseout", function(d, i) {});
      g.append("text").text(function(d) {
        return d.Count;
      });
      labels.selectAll("text").data(data).enter().append("text").text(function(d) {
        return bundeslaender_abkuerzungen(d.Bundesland);
      }).attr("x", function(d, i) {
        return i * (pb_width / data.length) + pb_padding + bar_padding + 5;
      }).attr("y", pb_height + 20).style("text-anchor", "middle");
      yAxis = d3.svg.axis().scale(y_scale).orient("right").ticks(5);
      xAxis = d3.svg.axis().scale(d3.scale.linear().domain([1, 16]).range([1, pb_width + pb_padding])).orient("bottom").tickValues(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
      svg.append("g").attr("class", "axis").attr("transform", "translate(0," + pb_height + ")").call(xAxis);
      return svg.append("g").attr("class", "y axis").attr("transform", "translate(" + (pb_width + pb_padding) + "," + pb_padding + ")").call(yAxis);
    });
  };

  gesamt = function() {
    var g1, g2, height, line, line2, margin, parseDate, svg, width, x, xAxis, y, y2, y2Axis, yAxis;
    margin = {
      top: 20,
      right: 80,
      bottom: 30,
      left: 80
    };
    width = 600 - margin.left - margin.right;
    height = 300 - margin.top - margin.bottom;
    x = d3.time.scale().range([0, width]);
    y = d3.scale.linear().range([height, 0]);
    y2 = d3.scale.linear().range([height, 0]);
    xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(d3.time.years, 1);
    yAxis = d3.svg.axis().scale(y).orient("left");
    y2Axis = d3.svg.axis().scale(y2).orient("right");
    line = d3.svg.line().x(function(d) {
      return x(d.Jahr);
    }).y(function(d) {
      return y(d.Anzahl);
    });
    line2 = d3.svg.line().x(function(d) {
      return x(d.Jahr);
    }).y(function(d) {
      return y2(d.Verbrauch);
    });
    parseDate = d3.time.format("%Y").parse;
    svg = d3.select("#gesamt_line").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    g1 = svg.append("svg:g").attr("class", "anzahl").attr("transform", "translate(0,0)");
    g2 = svg.append("svg:g").attr("class", "verbrauch").attr("transform", "translate(0,0)");
    return d3.csv("/eeg_unternehmen/gesamt.csv", function(error, data) {
      data.map(function(d) {
        d.Jahr = parseDate(d.Jahr);
        d.Anzahl = parseInt(d.Anzahl);
        return d.Verbrauch = parseInt(d.Verbrauch);
      });
      x.domain(d3.extent(data, function(d) {
        return d.Jahr;
      }));
      y.domain([
        0, d3.max(data, function(d) {
          return d.Anzahl;
        })
      ]);
      y2.domain([
        0, d3.max(data, function(d) {
          return d.Verbrauch;
        })
      ]);
      svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
      svg.append("g").attr("class", "y axis").attr("transform", "translate(-15,0)").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Anzahl Unternehmen");
      svg.append("g").attr("class", "y axis ").attr("transform", "translate(" + (width + 15) + ",0)").call(y2Axis).append("text").attr("transform", "rotate(-90)").attr("y", -16).attr("dy", ".71em").style("text-anchor", "end").text("Verbrauch in GwH");
      g1.append("path").datum(data).attr("class", "line").attr("d", line);
      return g2.append("path").datum(data).attr("class", "line 2").attr("d", line2);
    });
  };

  top_20_unternehmen = function() {
    var table, tbody, thead;
    table = d3.select("#top_20").append("table");
    thead = table.append("thead").append("tr");
    thead.append("td").text("Firma");
    thead.append("td").text("# Niederlassungen");
    tbody = table.append("tbody");
    return d3.csv("/eeg_unternehmen/niederlassungen_top_20.csv", function(error, data) {
      var tr;
      tr = tbody.selectAll("tr").data(data).enter().append("tr");
      tr.append("td").text(function(d) {
        return d.Firma;
      });
      return tr.append("td").text(function(d) {
        return d.Count;
      });
    });
  };

  $(function() {
    d3.csv("/eeg_unternehmen/per_bundesland.csv", function(error, data) {
      var entry;
      return bundeslaender = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          entry = data[_i];
          _results.push({
            bundesland: entry.Bundesland,
            count: 0
          });
        }
        return _results;
      })();
    });
    branchen();
    per_bundesland();
    gesamt();
    return top_20_unternehmen();
  });

}).call(this);

// Generated by CoffeeScript 1.5.0-pre
