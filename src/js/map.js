/* global d3 neighbs*/
class Map {
  constructor(changeDistrict) {
    this.features = [];
    this.width = document.querySelector('svg').clientWidth;
    this.height = 360;
    this.centered = null;
    this.path = null;
    this.mapLayer = null;
    this.changeDistrict = changeDistrict;
  }
  init(lat=-73.999914, lon=40.726932) {
    return new Promise((resolve, reject) => {
      var width = this.width,
          height = this.height;

      // var address_coordinates = [-74.0127715, 40.6787399];
      // x, y = this.projection(address_coordinates)

      // from turnout_by_district, get color and fill for all districts
      var ed_data;
      d3.json('../data/turnout_by_district.json', (error, edData) => {
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
      if (lat && lon) {
      this.projection = d3.geoMercator()
        .scale(450000)
        .center(address_coordinates)
        .translate([width / 2, height / 2]);
      } else {

      this.projection = d3.geoMercator()
        .scale(450000)
        .center(address_coordinates)
        .translate([width / 2, height / 2]);
      }

      this.path = d3.geoPath()
        .projection(this.projection);

      // Set svg width & height
      var svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height);

      // Add background
      svg.append('rect')
        .attr('class', 'background')
        .attr('width', width)
        .attr('height', height)
        .on('click', this.clicked.bind(this));

      var g = this.g = svg.append('g');

      this.mapLayer = g.append('g')
        .classed('map-layer', true);

      // Label neighborhoods using neighb_coords.js file
      this.g.selectAll("text")
        .data(neighbs).enter()
          .append('text')
          .text(d => d.name)
          .attr('x', d => this.projection(d.coords)[0])
          .attr('y', d => this.projection(d.coords)[1])
          .attr("text-anchor","middle")
          .attr('font-size','6pt');

      // Load map data
      d3.json('/data/districts.geojson', (error, mapData) => {
        this.features = mapData.features;

        // Draw each ed as a path
        this.mapLayer.selectAll('path')
            .data(this.features)
          .enter().append('path')
            .attr('d', this.path)
            .attr('vector-effect', 'non-scaling-stroke')
            .style('fill', fillFn)
            // .attr('district', isDistrict)
            .on('mouseover', mouseover)
            .on('mouseout', mouseout)
            .on('click', this.clicked.bind(this));

        // clickPoint = mapLayer.selectAll('circle')
        //   .data([address_coordinates]).enter()
        //   .append('circle')
        //   .attr('cx', d => this.projection(d)[0])
        //   .attr('cy', d => this.projection(d)[1])
        //   .attr('r', '4px')
        //   .attr('fill', 'pink')
        //   .attr('stroke', 'pink')

        // var x = this.projection(address_coordinates)[0];
        // var y = this.projection(address_coordinates)[1];

        this.getDistrict(address_coordinates);

        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      });

      // Get ed color
      function fillFn(d){
        var ed = d.properties.elect_dist;
        var hex_color = '#fff';
        if (ed_data[ed]){
          hex_color = ed_data[ed].color_option2;
        }
        return hex_color;
      }

      function mouseover(/*d*/){
        // Highlight hovered ed
        // d3.select(this).style('fill', 'orange');
      }

      function mouseout(/*d*/){
        // Reset ed color
        // mapLayer.selectAll('path')
        //   .style('fill', function(d){return centered && d===centered ? '#D5708B' : fillFn(d);});
      }
    });
  }


  getDistrict(address_coordinates){
    var return_val = "not found";
    this.features.forEach((d) => {
      if (d3.geoContains(d, address_coordinates)){
        return_val = d.properties.elect_dist;
        // click d
        this.clicked(d);
        d.fillFn;
      }
    });
    return return_val;
  }

  // When clicked, zoom in
  clicked(d) {
    var x, y, k;
    console.log(d && d.properties.elect_dist);
    this.district = d && d.properties.elect_dist;
    // Compute centroid of the selected path
    if (d && this.centered !== d) {
      var centroid = this.path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      k = 4;
      this.centered = d;
    } else {
      x = this.width / 2;
      y = this.height / 2;
      k = 1;
      this.centered = null;
    }
    if (d && d.properties && d.properties.elect_dist) {
      this.changeDistrict(d.properties.elect_dist);
    }

    // Highlight the clicked ed
    this.mapLayer.selectAll('path')
      // .style('stroke', function(d){
      //   return d.properties.elect_dist == district ? '#da6229' : '#fff';
      // })
      // .style('stroke-width', function(d){
      //   return d.properties.elect_dist == district ? '10px' : null;
      // })
      .style('fill-opacity', (d) => {
        return d.properties.elect_dist != this.district ? .5 : null;
      });

    // Zoom
    let w = this.width;
    let h = this.height;
    this.g.transition()
      .duration(750)
      .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
  }

  goToDistrict(district_id){
    this.features
    .filter(feature => feature.properties && feature.properties.elect_dist === district_id)
    .forEach(feature => this.clicked(feature));
  }
}

export default Map;
