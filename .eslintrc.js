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
    "d3": true,
    "neighbs": true,
    "Turnout": true,
    "gtag": true,
    "GA_TRACKING_ID": true,
    "GA_PROJECT_ID": true,
    "BASE_URL": true,
    "ROOT_PATH": true,
    "IS_SCREENSHOTTING": true,
    "SIGNUP_ENDPOINT": true,
  }
}
