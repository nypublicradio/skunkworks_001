function findDistrictByCoords(lat, lng) {
  let { districts:district } = Turnout.wherewolf.find([lng, lat]);
  if (!district) {
    return false;
  } else {
    return district.elect_dist;
  }
}

export function getDistrict(lat, lng) {
  let district = findDistrictByCoords(lat, lng);
  if (!district) {
    return {error: 'out of bounds', message: "Out of bounds"};
  } else {
    return getDistrictData(district);
  }
}

export function getDistrictData(electDist) {
  let district = Turnout.districts[electDist];
  if (!district) {
    return {error: 'no data', message: `Not enough data for district ${electDist}`};
  } else {
    return district;
  }
}
