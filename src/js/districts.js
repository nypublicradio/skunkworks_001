function findDistrictByCoords(lat, lng) {
  return new Promise((resolve, reject) => {
    Turnout.geoData.then(mapData => {
      let districts = mapData.features.filter(feature => {
        return d3.geoContains(feature, [lng, lat]);
      });
      if (districts.length > 0) {
        resolve(districts[0].properties["elect_dist"]);
      } else {
        reject({error: 'no district', message: `No district found for coordinates ${lat}, ${lng}`});
      }
    });
  });
}

export function getDistrict(lat, lng) {
  return findDistrictByCoords(lat, lng)
    .then(getDistrictData);
}

export function getDistrictData(electDist) {
  return new Promise((resolve, reject) => {
    Turnout.districts.then(edData => {
      if (!edData[electDist]) {
        reject({error: 'no data', message: `Not enough data for district ${electDist}`});
      } else {
        let data = edData[electDist];
        data.emoji = data.grade && data.grade.toLowerCase() || '';
        data.borough_data_2014 = edData["overall_data"]["by_borough_2014"][data.borough];
        resolve(data);
      }
    });
  });
}
