const $ = document.querySelector.bind(document);

const insertTemplate = (targetElement, templateString, id = '') => {
  let wrapper = document.createElement('div');
  wrapper.id = id;
  wrapper.innerHTML = templateString;
  if (targetElement.childNodes.length === 0) {
    targetElement.appendChild(wrapper);
  } else {
    targetElement.replaceChild(wrapper, targetElement.firstChild);
  }
};

export {
  $,
  insertTemplate,
};
