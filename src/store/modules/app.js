import Cookies from 'js-cookie';

// 侧边栏的状态切换
const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')  // + 转换数据格式 因为字符串的0为真
    },
    hosts: window.heikuConfig.url
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    }
  }
};

export default app;
