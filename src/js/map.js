/* global d3 */
class Map {
  constructor() {
    this.features = [];
  }
  init(lat=-73.999914, lon=40.726932, district) {
    return new Promise((resolve, reject) => {
      var width = 960,
          height = 500,
          centered;

      // var address_coordinates = [-74.0127715, 40.6787399];
      // x, y = projection(address_coordinates)

      // from turnout_by_district, get color and fill for all districts
      var ed_data;
      d3.json('../data/turnout_by_district.json', function(error, edData){
        ed_data = edData;
      });

      // d3.select(this).style('fill', 'orange');
      // g.selectAll("text")
      //   .data(neighbs).enter()
      //


      // Given coordinates, get district
       // x, y = projection(address_coordinates)


      // outline district in bold and zoom in


      // add zoom buttons (plus, minus)
      // navigation?



      // add a dot at address coordinates
      // var clickPoint;

      var address_coordinates = [lat, lon];
      var projection;
      if (lat && lon) {
      projection = d3.geoMercator()
        .scale(450000)
        .translate([width / 2, height / 2]);
      } else {

      projection = d3.geoMercator()
        .scale(450000)
        .center(address_coordinates)
        .translate([width / 2, height / 2]);
      }

      var path = d3.geoPath()
        .projection(projection);

      // Set svg width & height
      var svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height);

      // Add background
      svg.append('rect')
        .attr('class', 'background')
        .attr('width', width)
        .attr('height', height)
        .on('click', clicked);

      var g = svg.append('g');

      var mapLayer = g.append('g')
        .classed('map-layer', true);


      // Label neighborhoods using neighb_coords.js file
      g.selectAll("text")
        .data(neighbs).enter()
          .append('text')
          .text(function(d){return d.name})
          .attr('x', function(d){return projection(d.coords)[0]})
          .attr('y', function(d){return projection(d.coords)[1]})
          .attr("text-anchor","middle")
          .attr('font-size','6pt');

      // Load map data
      var features;
      d3.json('/data/districts.geojson', (error, mapData) => {
        features = mapData.features;
        this.features = features;

        // Draw each ed as a path
        mapLayer.selectAll('path')
            .data(features)
          .enter().append('path')
            .attr('d', path)
            .attr('vector-effect', 'non-scaling-stroke')
            .style('fill', fillFn)
            // .attr('district', isDistrict)
            .on('mouseover', mouseover)
            .on('mouseout', mouseout)
            .on('click', clicked);

        // clickPoint = mapLayer.selectAll('circle')
        //   .data([address_coordinates]).enter()
        //   .append('circle')
        //   .attr('cx', function (d) { return projection(d)[0]; })
        //   .attr('cy', function (d) { return projection(d)[1]; })
        //   .attr('r', '4px')
        //   .attr('fill', 'pink')
        //   .attr('stroke', 'pink')

        var x = projection(address_coordinates)[0];
        var y = projection(address_coordinates)[1];

        getDistrict(address_coordinates);

        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      });

      function getDistrict(address_coordinates){
        var return_val = "not found"
        features.forEach(function (d) {
          if (d3.geoContains(d, address_coordinates)){
            console.log(d);
            return_val = d.properties.elect_dist;
            // click d
            clicked(d);
            d.fillFn
          }
        });
        return return_val;
      }

      // Get ed color
      function fillFn(d){
        var ed = d.properties.elect_dist;
        var hex_color = '#fff';
        if (ed_data[ed]){
          hex_color = ed_data[ed].color_option2;
        }
        return hex_color
      }


      // When clicked, zoom in
      function clicked(d) {
        var x, y, k;
        console.log(d && d.properties.elect_dist)
        district = d && d.properties.elect_dist
        // Compute centroid of the selected path
        if (d && centered !== d) {
          var centroid = path.centroid(d);
          x = centroid[0];
          y = centroid[1];
          k = 4;
          centered = d;
        } else {
          x = width / 2;
          y = height / 2;
          k = 1;
          centered = null;
        }

        // Highlight the clicked ed
        mapLayer.selectAll('path')
          // .style('stroke', function(d){
          //   return d.properties.elect_dist == district ? '#da6229' : '#fff';
          // })
          // .style('stroke-width', function(d){
          //   return d.properties.elect_dist == district ? '10px' : null;
          // })
          .style('fill-opacity', function(d){
            return d.properties.elect_dist != district ? .5 : null;
          });


        console.log(x,y,k,centered);
        // Zoom
        g.transition()
          .duration(750)
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
      }

      this.clicked = clicked;

      function mouseover(d){
        // Highlight hovered ed
        // d3.select(this).style('fill', 'orange');
      }

      function mouseout(d){
        // Reset ed color
        // mapLayer.selectAll('path')
        //   .style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});

      }
    });
  }

  goToDistrict(district_id){
    this.features
    .filter(feature => feature.properties && feature.properties.elect_dist === district_id)
    .forEach(feature => this.clicked(feature));
  }
}

export default Map;
