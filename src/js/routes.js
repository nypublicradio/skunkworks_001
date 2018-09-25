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
    if (!Turnout.map) {
      let districtMapTemplate = require("./templates/district-map.hbs");
      let mainEl = $('main');
      insertTemplate(mainEl, districtMapTemplate({
        ...district,
        assetPath: ROOT_PATH,
      }));

      Turnout.map = new ElectionMap({selector: '#map'});
      Turnout.map.init()
        .then(() => Turnout.map.goToDistrict(district.elect_dist));
    } else {
      Turnout.map.goToDistrict(district.elect_dist);
    }

    this.loadDistrictDetails(district.elect_dist);

    gtag('config', GA_TRACKING_ID, {
      page_title: `District ${district.elect_dist}`,
    });
  },

  loadDistrictDetails(districtId) {
    let detailsEl = $('.district-details');
    let districtDetailsTemplate = require("./templates/district-details.hbs");
    getDistrictData(districtId).then(district => {
      $('.election-district').innerText = districtId;
      insertTemplate(detailsEl, districtDetailsTemplate({
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
