const router = {
  state: {
    path: []
  },

  mutations: {
    SET_PATH: (state, obj) => {
      state.path.push(obj)
    },
    DELETE_PATH: (state, index) => {
      state.path.splice(index, 1)
    }
  },

  actions: {
    AddPath({ commit }, obj) {
      commit('SET_PATH', obj);
    },
    DeletePath({ commit }, index) {
      commit('DELETE_PATH', index);
    }
  }
};

export default router;
