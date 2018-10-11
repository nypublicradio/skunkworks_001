import fetch from 'unfetch';

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

function insertErrorMessages(messages = [], el) {
  function insertMessage(message) {
    let li = document.createElement('li');
    li.textContent = message;
    ul.appendChild(li);
  }
  let ul = document.createElement('ul');
  messages.forEach(insertMessage);
  $(el).appendChild(ul);
}

function checkForErrors(fields) {
  let errors = [];
  fields.forEach(field => {
    let valid;
    let el = $(field.selector);
    if (field.validation) {
      valid = field.validation(el);
    } else {
      valid = !!el.value;
    }
    if (!valid) {
      errors.push(field.message);
    }
  });
  return errors;
}

export function bindAddressFormEvents(options) {
  const geocoder = new google.maps.Geocoder();
  let { errors, multiples, fields, form } = options;

  $(form).addEventListener('submit', e => {
    e.preventDefault();

    if (errors) {
      $(errors).textContent = '';
    }
    if (multiples) {
      $(multiples).textContent = '';
    }

    let errorMessages = checkForErrors(fields);

    if (errorMessages.length) {
      insertErrorMessages(errorMessages, errors);
      return;
    }

    $(form).classList.add('loading');

    let emailField = fields.find(field => field.name === 'email');
    let addressField = fields.find(field => field.name === 'address');

    if (emailField) {
      let email = $(emailField.selector).value;
      fetch(SIGNUP_ENDPOINT, {method: 'POST', body: JSON.stringify({email, timestamp: new Date()})});
    }

    if (addressField) {
      $(form).querySelector('button').setAttribute('disabled', true);
      let address = $(addressField.selector).value;
      lookupAddress(address, geocoder).then(result => {
        let district = getDistrict(result.lat, result.lng);
        if (!district.error) {
          Turnout.router.transitionTo('district', district);
        } else {
          let { error } = district;
          if (error.error === 'no data') {
            $(errors).textContent = error.message;
          }
        }
        $(form).classList.remove('loading');
      }).catch(error => {
        if(error.error === 'multiple locations') {
          $(multiples).textContent = '';
          let question = document.createElement('p');
          question.textContent = 'Did you mean...';
          $(multiples).appendChild(question);
          error.results.forEach(result => {
            let district = getDistrict(result.geometry.location.lat(), result.geometry.location.lng());
            let link = document.createElement('a');
            link.textContent = result.formatted_address;
            link.href = `${ROOT_PATH}${district.elect_dist}`;
            $(multiples).appendChild(link);
          });
        } else if (error.error === 'out of bounds') {
          $(errors).textContent = 'Please enter a valid NYC address';
        } else if (error.error === 'no results') {
          $(errors).textContent = 'Please enter a valid NYC address';
        } else {
          $(errors).textContent = `Something unexpected occurred. Got status: ${error.error}`;
        }
        $(form).classList.remove('loading');
      })
      .finally(() => $(form).querySelector('button').removeAttribute('disabled'));
    }
    return false;
  });
}
