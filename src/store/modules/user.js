import { login, logout, getInfo } from '@/api/login';
import { getToken, setToken, removeToken, setTokenTime } from '@/utils/auth';
const user = {
  state: {
    token: getToken(),  // 获取当前token
    id: '',       // 用户id
    name: '',       // 用户名称
    avatar: '',     // 用户头像
    roles: []       // 角色列表--用户权限
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_USER_ID: (state, id) => {
      state.id = id;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const name = userInfo.account.trim();  // 注册时，传入的参数
      // 返回Promise实例
      return new Promise((resolve, reject) => {
        login(name, userInfo.password).then(response => {
          const data = response;
          // 将token存在cookie中
          setToken(data.token);
          setTokenTime(new Date().getTime());
          // 将token存在vuex状态中
          commit('SET_TOKEN', data.token);
          // 将Promise对象的状态从“未完成”变为“成功”
          resolve();
        }).catch(error => {
          // 将Promise对象的状态从“未完成”变为“失败
          reject(error);
        });
      });
    },


    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response;
          commit('SET_USER_ID', data.id);
          commit('SET_ROLES', data.module_privilege);
          commit('SET_NAME', data.account);
          commit('SET_AVATAR', data.avatar);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
        resolve();
      });
    }
  }
};

export default user;
