// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
// 加载进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'normalize.css/normalize.css'
import '@/assets/iconfont/iconfont'
import IconSvg from '@/components/Icon-svg/index.vue'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

Vue.config.productionTip = false

Vue.use(ElementUI);
// 全局配置IconSvg
Vue.component('icon-svg', IconSvg)

const whiteList = ['/login'];
router.beforeEach((to, from, next) => {
  NProgress.start();
  // 每次路由切换都要进行 cookie验证
  if (getToken()) {
    // 如果已经记录cookie 则直接跳转 '/'
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      // 判断用户权限 0 未没有任何权限 需要登录
      if (store.getters.roles.length === 0) {
        // 获取用户信息
        store.dispatch('GetInfo').then(res => {
          // 根据用户权限 进行路由配置
          store.dispatch('GenerateRoutes', res).then(() => {
            // 动态配置路由
            if (store.getters.addRouters) {
              router.addRoutes(store.getters.addRouters);
              next({ ...to });
            } else {
              next({ ...to });
              Message({
                message: '请管理员，大帐号进行权限配置，再登录',
                type: 'error',
                duration: 2 * 1000
              });
            }
          })
        }, () => {
          // token过期
          // store.dispatch('FedLogOut').then(() => {
          //   location.reload();
          // });
        })
      } else {
        next();
      }
    }
  } else {
    // 在未记录cookie时，更改路径为/login
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next('/login');
      NProgress.done();
    }
  }
});
// 路由加载结束
router.afterEach(() => {
  NProgress.done();
});

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
