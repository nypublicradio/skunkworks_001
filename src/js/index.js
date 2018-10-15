import Router from 'router_js';
import fetch from 'unfetch';
import Wherewolf from 'wherewolf';

import { $, insertTemplate } from './dom';
import {
  IndexRoute,
  DistrictRoute
} from './routes';

import LoadingTemplate from './templates/loading.hbs';

const Turnout = window.Turnout = {};

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

document.addEventListener('DOMContentLoaded', function() {
  $('.page').classList.add('is-loading');
  insertTemplate($('#main-wrapper'), LoadingTemplate());
  Promise.all([
    fetch(`${BASE_URL}${ROOT_PATH}data/districts.geojson`).then(r => r.json()),
    fetch(`${BASE_URL}${ROOT_PATH}data/turnout_by_district.json`).then(r => r.json()),
  ]).then(([ geoData, districts]) => {
    Object.keys(districts).forEach(key => {
      let district = districts[key];
      district.emoji = district.grade && district.grade.toLowerCase() || '';
      district.borough_data_2014 = districts["overall_data"]["by_borough_2014"][district.borough];
      district.max_rank_2016 = districts["overall_data"]["max_rank_2016"];
    });
    Turnout.geoData = geoData;
    Turnout.districts = districts;

    Wherewolf.add('districts', Turnout.geoData.features);
    Turnout.wherewolf = Wherewolf;

    router.handleURL(window.location.pathname)
      .then(() => setTimeout(() => $('.page').classList.remove('is-loading'), 0));
  });

  // Removes target="_blank" from submit forms to allow for iOS form submission
  // with blue "Go" button
  document.addEventListener('submit', function(e) {
    if(navigator.userAgent.match(/(iPod|iPhone|iPad)/i)) {
      e.target.setAttribute('target','');
    }
  });
});
