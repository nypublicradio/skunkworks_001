const DEFAULT_OPTIONS = {
  selector: '#map',
};

class ElectionMap {
  constructor(options = {}) {
    options = {...DEFAULT_OPTIONS, ...options};
    this.features = [];
    this.width = document.querySelector(options.selector).clientWidth;
    this.height = 360;
    this.centered = null;
    this.path = null;
    this.mapLayer = null;

    this.options = options;
  }
  init() {
    return new Promise((resolve) => {
      var width = this.width,
          height = this.height;

      // NYC
      var default_coordinates = [-73.999914, 40.726932];
      this.projection = d3.geoMercator()
        .scale(450000)
        .center(default_coordinates)
        .translate([width / 2, height / 2]);

      this.path = d3.geoPath()
        .projection(this.projection);

      // Set svg width & height
      var svg = d3.select(this.options.selector)
        .attr('width', width)
        .attr('height', height);

      // Add background
      svg.append('rect')
        .attr('class', 'background')
        .attr('width', width)
        .attr('height', height);

      if ('ontouchend' in window) {
        svg.on('touchend', this.clicked);
      } else {
        svg.on('click', this.clicked);
      }


      var g = this.g = svg.append('g');

      this.mapLayer = g.append('g')
        .classed('map-layer', true);

      g.append('g')
        .classed('selected-map-layer', true)
      .append('path');

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
        this.features = Turnout.geoData.features;

        // Draw each ed as a path
        this.mapLayer.selectAll('path')
          .data(this.features)
          .enter().append('path')
          .attr('d', this.path)
          .attr('vector-effect', 'non-scaling-stroke')
          .style('fill', ({properties: {elect_dist}}) => {
            return Turnout.districts[elect_dist] ? Turnout.districts[elect_dist].color : '#fff';
          });

        resolve(this);
      });
  }


  // When clicked, zoom in
  clicked() {
    let el = d3.event.target;
    if (!el) {
      return;
    }
    let data = d3.select(el).datum();
    if (!data) {
      return;
    }
    let district = Turnout.districts[data.properties.elect_dist];
    if (district) {
      Turnout.router.transitionTo('district', district);
    }
  }

  centerOn(d) {
    var x, y, k;
    this.district = d && d.properties && d.properties.elect_dist;

    if (this.district) {
      d3.select('.selected-map-layer path')
        .data([d])
        .attr('d', this.path(d));
    }

    // Compute centroid of the selected path
    if (d && this.centered !== d) {
      var centroid = this.path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      k = IS_SCREENSHOTTING ? 2.2 : 1;
      this.centered = d;
    } else {
      x = this.width / 2;
      y = this.height / 2;
      k = 1;
      this.centered = null;
    }

    // Zoom
    let w = this.width;
    let h = this.height;
    this.g.transition()
      .duration(IS_SCREENSHOTTING ? 0 : 750)
      .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')');
  }

  goToDistrict(districtId) {
    let datum = this.features
      .find(feature => feature.properties && feature.properties.elect_dist === districtId);

    if (datum) {
      this.centerOn(datum);
    }
  }
}

export default ElectionMap;
