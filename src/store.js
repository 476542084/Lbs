import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token:'',
    userInfo:{},
  },
  mutations: {
    set_token(state, token) {
      state.token = token
      sessionStorage.token = token
    },
    del_token(state) {
      state.token = ''
      sessionStorage.removeItem('token')
    },
    set_userInfo(state,userInfo){
      state.userInfo = userInfo
      sessionStorage.userInfo = JSON.stringify(userInfo)
    },
    del_userInfo(state){
      state.userInfo = {}
      sessionStorage.userInfo = ''
    }
  },
  actions: {

  },
});
