/*global require */

document.addEventListener('DOMContentLoaded', function () {
  const $ = document.querySelector.bind(document);

  function init() {
    loadAddressEntryView();
  }

  function loadAddressEntryView() {
    let mainTemplate = require("./templates/main.hbs");
    let mainEl = $('main');
    mainEl.innerHTML = mainTemplate({});

    //setup events
    document.addEventListener('submit', $('.address-form__form'), () => {
      loadDistrictDetailView();
      return false;
    });
  }

  function loadDistrictDetailView() {

  }

  init();
});
