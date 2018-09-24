module.exports = {
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "browser": true,
    "es6":  true
  },
  "rules": {
    "semi": 2
  },
  "globals": {
    "require": true,
    "google": true,
    "ROOT_PATH": true,
    "IS_SCREENSHOTTING": true,
    "d3": true,
    "neighbs": true,
  }
}
