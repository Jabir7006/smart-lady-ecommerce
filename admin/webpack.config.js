const buildConfig = require('./src/config/build-config');

module.exports = {
  ...buildConfig.webpack.configure({
    // Your existing webpack config
  })
}; 