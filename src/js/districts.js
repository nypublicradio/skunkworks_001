function findDistrictByCoords(lat, lng) {
  function callback(resolve, reject, error, mapData) {
    if (error) {
      reject(error);
    }
    let districts = mapData.features.filter(feature => {
      return d3.geoContains(feature, [lng, lat]);
    });
    if (districts.length > 0) {
      resolve(districts[0].properties["elect_dist"]);
    } else {
      reject(error);
    }
  }
  return new Promise((resolve, reject) => {
    if (!Turnout.geoData) {
      d3.json(`${window.location.origin}${ROOT_PATH}data/districts.geojson`, (error, mapData) => {
        Turnout.geoData = mapData;
        callback(resolve, reject, error, Turnout.geoData);
      });
    } else {
      callback(resolve, reject, null, Turnout.geoData);
    }
  });
}

export function getDistrict(lat, lng) {
  return findDistrictByCoords(lat, lng)
    .then(getDistrictData);
}

export function getDistrictData(electDist) {
  function callback(resolve, reject, error, edData) {
    if (error) {
      reject(error);
    } else if (!edData[electDist]) {
      reject({error: 'no data', message: `Not enough data for district ${electDist}`});
    } else {
      let data = edData[electDist];
      data.emoji = data.grade && data.grade.toLowerCase() || '';
      data.borough_data_2014 = edData["overall_data"]["by_borough_2014"][data.borough];
      resolve(data);
    }
  }
  return new Promise((resolve, reject) => {
    if (!Turnout.districts) {
      d3.json(`${window.location.origin}${ROOT_PATH}data/turnout_by_district.json`, (error, edData) => {
        Turnout.districts = edData;
        callback(resolve, reject, error, Turnout.districts);
      });
    } else {
      callback(resolve, reject, null, Turnout.districts);
    }
  });
}
