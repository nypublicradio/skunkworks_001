/*global require google*/
import Map from './map';

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
    return Promise.resolve({
      id: '23002'
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
          reject({error: `bad status: ${status}`})
        } else if (results.length > 1) {
          reject({error: 'multiple locations', results})
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
    let mapTemplate = require("./templates/district-details.hbs");

    let districtMapTemplate = require("./templates/district-map.hbs");
    let districtDetailsTemplate = require("./templates/district-details.hbs");
    let mainEl = $('main');
    mainEl.innerHTML = districtMapTemplate(district);
    //bindAddressFormEvents('.address-form__form','.address-form__errors','.address-form__multiples');
    let map = new Map();
    map.init()
    .then(_ => map.goToDistrict(district.id));
  }

  init();
});
