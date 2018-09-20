/*global require google ASSET_PATH d3*/
import Map from './map';

document.addEventListener('DOMContentLoaded', function () {
  var currentView;
  const $ = document.querySelector.bind(document);
  const geocoder = new google.maps.Geocoder();
  function insertTemplate(targetElement, templateString, id='') {
    let wrapper = document.createElement('div');
    wrapper.id = id;
    wrapper.innerHTML = templateString;
    if (targetElement.childNodes.length === 0) {
      targetElement.appendChild(wrapper);
    } else {
      targetElement.replaceChild(wrapper, targetElement.firstChild);
    }

  }

  function init() {
    let districtMatch = document.location.pathname.match(/(\d{5})\/$/);
    if (districtMatch && districtMatch[1]) {
      return getDistrictData(districtMatch[1])
      .then(loadDistrictDetailView);
    } else {
      loadAddressEntryView();
    }
    d3.json(`${window.location.origin}${ASSET_PATH}data/districts.geojson`);
    d3.json(`${window.location.origin}${ASSET_PATH}data/turnout_by_district.json`);
  }

  function loadAddressEntryView() {
    currentView = 'home';
    let mainTemplate = require("./templates/main.hbs");
    let mainEl = $('main');
    insertTemplate(mainEl, mainTemplate({
      assetPath: ASSET_PATH,
    }));
    bindAddressFormEvents('.address-form__form','.address-form__errors','.address-form__multiples');
  }

  function bindAddressFormEvents(form, errors, multiples) {
    $(form).addEventListener('submit', e => {
      $(form).classList.add('loading');
      $(errors).innerHTML = '';
      $(multiples).innerHTML = '';
      e.preventDefault();
      let address = $('.address-form__input').value;
      lookupAddress(address).then(result => {
        getDistrict(result.lat, result.lng).then(district => {
          loadDistrictDetailView(district);
        });
        $(form).classList.remove('loading');
      }).catch(error => {
        console.log('error! ', error);
        if(error.error === 'multiple locations') {
          $(multiples).innerHTML = '';
          let question = document.createElement('p');
          question.innerText = 'Did you mean...'
          $(multiples).appendChild(question);
          error.results.forEach(result => {
            console.log(result)
            getDistrict(result.geometry.location.lat(), result.geometry.location.lng())
            .then(district => {
              let link = document.createElement('a');
              link.innerText = result.formatted_address;
              link.href = `/${district.id}`;
              $(multiples).appendChild(link);
            });
          });
        } else {
          $(errors).innerText = 'Invalid Address';
        }
        $(form).classList.remove('loading');
      });
      return false;
    });
  }

  function getDistrict(lat, lng) {
    return findDistrictByCoords(lat, lng)
      .then(getDistrictData);
  }

  function findDistrictByCoords(lat, lng) {
    return new Promise((resolve, reject) => {
      console.log(lat, lng);
      d3.json(`${window.location.origin}${ASSET_PATH}data/districts.geojson`, (error, mapData) => {
        if (error) {
          reject(error);
        };
        let districts = mapData.features.filter(feature => {
          return d3.geoContains(feature, [lng, lat]);
        });
        if (districts.length > 0) {
          resolve(districts[0].properties["elect_dist"]);
        } else {
          reject(error)
        }
      })
    });
  }

  function getDistrictData(electDist) {
    return new Promise((resolve, reject) => {
      d3.json(`${window.location.origin}${ASSET_PATH}data/turnout_by_district.json`, (error, edData) => {
        if (error) {
          reject(error);
        } else {
          let data = edData[electDist];
          data.emoji = data.grade && data.grade.toLowerCase() || '';
          resolve(data);
        }
      });
    });
  }

  function lookupAddress(address) {
    const inNYC = ({address_components}) => address_components
      .filter(a => a.types.includes('administrative_area_level_2'))
      .find(n => n.long_name.match(/(Kings|Queens|New York|Richmond|Bronx) County/));
    return new Promise((resolve, reject) => {
      geocoder.geocode({
        address,
        componentRestrictions: {
          administrativeArea: 'NY'
        }
      }, (results, status) => {
        if (results.length === 0) {
          reject({error: 'no results'});
        } else if (status !== 'OK') {
          reject({error: `bad status: ${status}`});
        } else if (results.length > 1) {
          reject({error: 'multiple locations', results});
        } else if (!inNYC(results[0])) {
          reject({error: 'out of bounds'});
        } else {
          let [{
            formatted_address: formattedAddress,
            geometry: { location: latlng }
          }] = results;

          resolve({
            ...latlng.toJSON(),
            formattedAddress,
          });
        }
      });
    });
  }

  function loadDistrictDetails(districtId) {
    let detailsEl = $('.district-details');
    let districtDetailsTemplate = require("./templates/district-details.hbs");
    getDistrictData(districtId).then(district => {
      if(currentView) {
        window.history.pushState(district, '', `${window.location.origin}/${district.elect_dist}/`);
      }
      $('.election-district').innerText = districtId;
      insertTemplate(detailsEl, districtDetailsTemplate({
        ...district,
        assetPath: ASSET_PATH,
      }));
      bindAddressFormEvents('.address-form__form','.address-form__errors','.address-form__multiples');
    });
  }

  function loadDistrictDetailView(district) {
    currentView = 'details';

    let districtMapTemplate = require("./templates/district-map.hbs");
    let mainEl = $('main');
    insertTemplate(mainEl, districtMapTemplate({
      ...district,
      assetPath: ASSET_PATH,
    }));

    let map = new Map(loadDistrictDetails);
    map.init()
    .then(() => map.goToDistrict(district.elect_dist));
  }

  init();
});
