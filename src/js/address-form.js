import { $ } from './dom';
import {
  getDistrict
} from './districts';

function lookupAddress(address, geocoder) {
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
        reject({error: status});
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


export function bindAddressFormEvents(form, errors, multiples) {
  const geocoder = new google.maps.Geocoder();

  $(form).addEventListener('submit', e => {
    $(form).classList.add('loading');
    $(errors).textContent = '';
    $(multiples).textContent = '';
    e.preventDefault();
    let address = $('.address-form__input').value;
    lookupAddress(address, geocoder).then(result => {
      getDistrict(result.lat, result.lng).then(district => {
        Turnout.router.transitionTo('district', district);
      }).catch(error => {
        if (error.error === 'no data') {
          $(errors).textContent = error.message;
        }
      });
      $(form).classList.remove('loading');
    }).catch(error => {
      if(error.error === 'multiple locations') {
        $(multiples).textContent = '';
        let question = document.createElement('p');
        question.textContent = 'Did you mean...';
        $(multiples).appendChild(question);
        error.results.forEach(result => {
          getDistrict(result.geometry.location.lat(), result.geometry.location.lng())
          .then(district => {
            let link = document.createElement('a');
            link.textContent = result.formatted_address;
            link.href = `${ROOT_PATH}${district.elect_dist}`;
            $(multiples).appendChild(link);
          });
        });
      } else if (error.error === 'out of bounds') {
        $(errors).textContent = 'Please use an address in the 5 boroughs';
      } else if (error.error === 'no results') {
        $(errors).textContent = 'Invalid Address';
      } else {
        $(errors).textContent = `Something unexpected occurred. Got status: ${error.error}`;
      }
      $(form).classList.remove('loading');
    });
    return false;
  });
}
