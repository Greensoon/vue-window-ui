// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
    build: {
        env: {NODE_ENV: JSON.stringify('production')},
        assetsRoot: path.join(__dirname, './dist'),
        assetsPublicPath: path.join(__dirname, './dist')
    },
    dev: {
        env: {NODE_ENV: JSON.stringify('development')},
        assetsPublicPath: '/',
        assetsRoot: path.join(__dirname, './tmp'),
    }
}