var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ROUTE_NAME_FOOT: '" - 盈店通"',
  IFRAM_DOMAIN: '"localhost"',
  DOMAIN: '"https://devserver.onloon.com.cn"',
  ADS_DOMAIN: '"http://matrixtest.onloon.cn"',
  IMG_DOMAIN: '"https://server.onloon.cc"',
  API_HOST:'".onloon.com.cn"',
  HOMEPAGE: '"http://localhost:8086"',
  HOMEPAGE_DOMAIN: '"localhost:8086"'
})

