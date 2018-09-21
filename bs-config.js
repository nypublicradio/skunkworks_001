const historyFallback = require('connect-history-api-fallback');

module.exports = {
  server: {
    baseDir: './dist',
    middleware: [
      historyFallback(),
    ]
  }
};
