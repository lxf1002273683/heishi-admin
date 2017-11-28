// 发布环境 配置URL请求
const heikuConfig = require('../api.config')

module.exports = {
  NODE_ENV: '"production"',
  BASE_API: heikuConfig['url']
}
