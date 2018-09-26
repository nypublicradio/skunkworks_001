import { $ } from './dom';
import { bindAddressFormEvents } from './address-form';
import { getDistrictData } from './districts';
import ElectionMap from './map';

import EmojiTemplate from './templates/emoji.hbs';
import MapTemplate from './templates/district-map.hbs';
import MainTemplate from './templates/main.hbs';
import DistrictTemplate from './templates/district-details.hbs';

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

const IndexRoute = {
  setup() {
    // clear old map if it exists
    Turnout.map = null;
    insertTemplate($('main'), MainTemplate({
      assetPath: ROOT_PATH,
    }));
    bindAddressFormEvents({
      form: '.address-form__form',
      errors: '.address-form__errors',
      multiples: '.address-form__multiples',
      fields: [{
        name: 'address',
        selector: '#address-form__address-input',
        message: 'Please enter an address.',
      }, {
        name: 'email',
        selector: '#address-form__email-input',
        message: 'Please enter an email.',
      }, {
        name: 'legal',
        selector: '#legal',
        message: 'Please agree to the terms',
        validation: el => el.checked,
      }]
    });

    gtag('config', GA_TRACKING_ID, {
      page_title: 'Does Your Block Vote?',
    });
  },
};

const DistrictRoute = {
  serialize(district) {
    return { districtId: district.elect_dist };
  },

  model({ districtId }) {
    window.scrollTo(0, 0);
    return getDistrictData(districtId);
  },

  setup(district) {
    let ad = district.elect_dist.slice(0, 2);
    let ed = district.elect_dist.slice(2);
    let emoji = EmojiTemplate({emoji: district.emoji, assetPath: ROOT_PATH});

    if (!Turnout.map) {
      insertTemplate($('main'), MapTemplate({
        ...district,
        emoji,
        ad,
        ed,
        assetPath: ROOT_PATH,
      }));

      Turnout.map = new ElectionMap({selector: '#map'});
      Turnout.map.init()
        .then(() => Turnout.map.goToDistrict(district.elect_dist));
    } else {
      insertTemplate($('#emoji'), emoji);
      $('#grade').textContent = district.grade;
      $('#election-district').textContent = ed;
      $('#assembly-district').textContent = ad;

      Turnout.map.goToDistrict(district.elect_dist);
    }

    this.loadDistrictDetails(district.elect_dist);

    gtag('config', GA_TRACKING_ID, {
      page_title: `District ${district.elect_dist}`,
    });
  },

  loadDistrictDetails(districtId) {
    getDistrictData(districtId).then(district => {
      insertTemplate($('.district-details'), DistrictTemplate({
        ...district,
        assetPath: ROOT_PATH,
      }));
      bindAddressFormEvents({
        form: '#address-form',
        errors: '#address-errors',
        multiples: '.address-form__multiples',
        fields: [{
          name: 'address',
          selector: '#address-form__address-input',
          message: 'Please enter an address.',
        }]
      });
      bindAddressFormEvents({
        form: '#email-form',
        errors: '#email-errors',
        fields: [{
          name: 'email',
          selector: '#address-form__email-input',
          message: 'Please enter an email.',
        }, {
          name: 'legal',
          selector: '#legal',
          message: 'Please agree to the terms',
          validation: el => el.checked,
        }]
      });
    });
  }
};


export {
  IndexRoute,
  DistrictRoute,
};
