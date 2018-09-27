function findDistrictByCoords(lat, lng) {
  let { districts:district } = Turnout.wherewolf.find([lng, lat]);
  if (!district) {
    return false;
  } else {
    return district.elect_dist;
  }
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
