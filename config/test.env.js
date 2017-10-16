var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  ROUTE_NAME_FOOT: '" - 盈店通"',
  IFRAM_DOMAIN: '"onloon.com.cn"',
  ADS_DOMAIN: '"http://matrixtest.onloon.cn"',
  DOMAIN: '"https://server.onloon.com.cn"',
  ADS_DOMAIN: '"http://matrixtest.onloon.cn"',
  IMG_DOMAIN: '"https://server.onloon.com.cn"',
  API_HOST: '".onloon.com.cn"',
  HOMEPAGE: '"https://buyer.onloon.com.cn"',
  HOMEPAGE_DOMAIN: '"buyer.onloon.com.cn"'
})
