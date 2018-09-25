import Router from 'router_js';
import fetch from 'unfetch';

import {
  IndexRoute,
  DistrictRoute
} from './routes';

const Turnout = window.Turnout = {
  geoData: fetch(`${BASE_URL}${ROOT_PATH}data/districts.geojson`).then(r => r.json()),
  districts: fetch(`${BASE_URL}${ROOT_PATH}data/turnout_by_district.json`).then(r => r.json()),
};

const handlers = {
  index: IndexRoute,
  district: DistrictRoute,
};

const router = Turnout.router = new Router({
  getHandler: name => handlers[name],
  getSerializer: name => handlers[name].serializer,
  updateURL: url => window.history.pushState(null, null, url),
});

router.map(function(match) {
  match(`${ROOT_PATH}`).to('index');
  match(`${ROOT_PATH}:districtId`).to('district');
});

window.addEventListener('popstate', () => router.handleURL(window.location.pathname));

document.addEventListener('DOMContentLoaded', function () {
  router.handleURL(window.location.pathname);
});
