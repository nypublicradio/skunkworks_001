import { $, insertTemplate } from './dom';
import { bindAddressFormEvents } from './address-form';
import { getDistrictData } from './districts';
import ElectionMap from './map';

import EmojiTemplate from './templates/emoji.hbs';
import MapTemplate from './templates/district-map.hbs';
import MainTemplate from './templates/main.hbs';
import DistrictTemplate from './templates/district-details.hbs';


const IndexRoute = {
  enter() {
    $('main').classList.add('index');
  },
  exit() {
    $('main').classList.remove('index');
  },
  setup() {
    // clear old map if it exists
    Turnout.map = null;
    insertTemplate($('#main-wrapper'), MainTemplate({
      assetPath: ROOT_PATH,
    }), 'index');
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
        validation: () => true
      }, {
        name: 'legal',
        selector: '#legal',
        message: 'Please confirm you agree to the terms.',
        validation: (el) => {
          return el.checked;
        }
      }]
    });

    document.title = 'Does Your Block Vote?';
    window.dataLayer.push({event: 'pageview'});
  },
};

const DistrictRoute = {
  enter() {
    $('main').classList.add('district');
  },
  exit() {
    $('main').classList.remove('district');
  },
  serialize(district) {
    return { districtId: district.elect_dist };
  },

  beforeModel() {
    window.scrollTo(0, 0);
  },

  model({ districtId }) {
    return getDistrictData(districtId);
  },

  setup(district) {
    let ad = district.elect_dist.slice(0, 2);
    let ed = district.elect_dist.slice(2);
    let emoji = EmojiTemplate({emoji: district.emoji, assetPath: ROOT_PATH});

    if (!Turnout.map) {
      insertTemplate($('#main-wrapper'), MapTemplate({
        ...district,
        emoji,
        ad,
        ed,
        assetPath: ROOT_PATH,
      }), 'district-map');

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
  },

  afterModel(model, transition) {
    transition.then(() => {
      document.title = `District ${model.elect_dist}`;
      window.dataLayer.push({event: 'pageview'});
    });
  },

  loadDistrictDetails(districtId) {
    let district = Turnout.districts[districtId];
    if (district) {
      insertTemplate($('.district-details'), DistrictTemplate({
        ...district,
        assetPath: ROOT_PATH,
        shareUrl: `${BASE_URL}${ROOT_PATH}${district.elect_dist}`,
        shareTitle: "Does Your Block Vote?",
        shareText: "Voter turnout varies dramatically from one block to another in New York City. Find out if your neighbors vote -- and how to get them to the polls if they don't."
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
    }
  }
};


export {
  IndexRoute,
  DistrictRoute,
};
