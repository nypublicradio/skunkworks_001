import { $ } from './dom';
import { bindAddressFormEvents } from './address-form';
import { getDistrictData } from './districts';
import ElectionMap from './map';

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
    let mainTemplate = require("./templates/main.hbs");
    let mainEl = document.querySelector('main');
    insertTemplate(mainEl, mainTemplate({
      assetPath: ROOT_PATH,
    }));
    bindAddressFormEvents('.address-form__form','.address-form__errors','.address-form__multiples');

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
    let ed = district.elect_dist.slice(2).replace('0', '');
    let emoji = require('./templates/emoji.hbs')({emoji: district.emoji, assetPath: ROOT_PATH});

    if (!Turnout.map) {
      let districtMapTemplate = require("./templates/district-map.hbs");
      insertTemplate($('main'), districtMapTemplate({
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
    let districtDetailsTemplate = require("./templates/district-details.hbs");
    getDistrictData(districtId).then(district => {
      insertTemplate($('.district-details'), districtDetailsTemplate({
        ...district,
        assetPath: ROOT_PATH,
      }));
      bindAddressFormEvents('.address-form__form','.address-form__errors','.address-form__multiples');
    });
  }
};


export {
  IndexRoute,
  DistrictRoute,
};
