// 发布环境 配置URL请求
let url = '"http://apitest.ontheroadstore.com"'
//  线上版本打包时，加 --prod参数
if (process.argv[2] === 'prod') {
	url = '"http://api.ontheroadstore.com"'
}
console.log(process.argv)
module.exports = {
  NODE_ENV: '"production"',
  BASE_API: url
}
