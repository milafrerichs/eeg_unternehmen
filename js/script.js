(function() {
  var branchen, bundeslaender, bundeslaender_abkuerzungen, bundesland_branchen, per_bundesland;

  bundeslaender = [];

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
      color = d3.scale.category20();
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
      center.append("text").attr("transform", "translate(0,0)").style("opacity", "0").style("text-anchor", "middle").style("font-size", "40px").text(function(d) {
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
    colors = d3.scale.category20c();
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
        return "rgb(0, " + (155 - i * 10) + ", " + (255 - i * 10) + ")";
      }).on("mouseover", function(d, i) {}).on("mouseout", function(d, i) {});
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
    return per_bundesland();
  });

}).call(this);

// Generated by CoffeeScript 1.5.0-pre
