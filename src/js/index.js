/*global require */
let mainTemplate = require("./templates/main.hbs");
let districtTemplate = require("./templates/district.hbs");

let mainEl = document.querySelector('main');


mainEl.innerHTML = mainTemplate({});
