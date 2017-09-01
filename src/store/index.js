import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import permission from './modules/permission';
import getters from './getters';

// 配置vuex
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,	// 模块
    user,
    permission
  },
  getters
});

export default store
