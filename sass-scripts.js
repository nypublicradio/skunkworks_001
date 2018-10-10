require('dotenv').config();
const sass = require('node-sass');

module.exports = {
  "imagePath($path: '')": function(path) {
    let base = process.env.AWS_S3_KEY ? `/${process.env.AWS_S3_KEY}/` : '/';
    return new sass.types.String(`${base}${path.getValue()}`);
  }
}
