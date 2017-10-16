var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"devTesting"',
  ROUTE_NAME_FOOT: '" - 盈店通"',
  IFRAM_DOMAIN: '"onloon.com.cn"',
  /**
   * 用于facebook 登录
   * @type {String}
   */
  ADS_DOMAIN: '"http://matrixtest.onloon.cn"',
  DOMAIN: '"https://devserver.onloon.com.cn"',
  ADS_DOMAIN: '"http://matrixtest.onloon.cn"',
  IMG_DOMAIN: '"https://devserver.onloon.com.cn"',
  API_HOST: '".onloon.com.cn"',
  HOMEPAGE: '"https://devbuyer.onloon.com.cn"',
  HOMEPAGE_DOMAIN: '"devbuyer.onloon.com.cn"'
})
