/*global require google*/

document.addEventListener('DOMContentLoaded', function () {
  const $ = document.querySelector.bind(document);
  const geocoder = new google.maps.Geocoder();
  function insertTemplate(element, templateString) {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = templateString;
    element.appendChild(wrapper);
  }

  function init() {
    let districtMatch = document.location.pathname.match(/(\d{5})\/$/);
    if (districtMatch && districtMatch[1]) {
      let district = {
        id: districtMatch[1],
        grade: 'A',
        img: 'a',
        scoretext: 'Okay'
      }
      loadDistrictDetailView(district, false);
      return;
    }
    loadAddressEntryView();
  }

  function loadAddressEntryView() {
    let mainTemplate = require("./templates/main.hbs");
    let mainEl = $('main');
    insertTemplate(mainEl, mainTemplate({}));

    //setup events
    $('.address-form__form').addEventListener('submit', e => {
      $('.address-form__form').classList.add('loading');
      e.preventDefault();
      let address = $('.address-form__input').value;
      lookupAddress(address).then(result => {
        console.log('result! ', result);
        getDistrict(result.lat, result.lng).then(district => {
          loadDistrictDetailView(district);
        });
        $('.address-form__form').classList.remove('loading');
      }).catch(error => {
        console.log('error! ', error);
        $('.address-form__form').classList.remove('loading');
      });
      return false;
    });
  }

  function getDistrict(lat, lng) {
    return Promise.resolve({
      id: '23002'
    });
  }

  function lookupAddress(address) {
    const inNYC = ({address_components}) => address_components
      .filter(a => a.types.includes('administrative_area_level_2'))
      .find(n => n.long_name.match(/(Kings|Queens|New York|Richmond|Bronx) County/));
    console.log('address: ', address);
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
          reject({error: `bad status: ${status}`})
        } else if (results.length > 1) {
          reject({error: 'mu  bltiple locations', results})
        } else if (!inNYC(results[0])) {
          reject({error: 'out of bounds'})
        } else {
          let [{
            formatted_address: formattedAddress,
            geometry: { location: latlng }
          }] = results;

          resolve({
            formattedAddress,
            ...latlng.toJSON()
          });
        }
      })
    });
  }

  function loadDistrictDetailView(district, navigatedHere=true) {
    if(navigatedHere) {
      window.history.pushState(district, '', `/${district.id}/`);
    }
    let districtTemplate = require("./templates/district-details.hbs");
    let mainEl = $('main');
    mainEl.innerHTML = districtTemplate(district);
  }

  init();
});
