import Vue from 'vue'
import App from './App.vue'

import '@/static/style/base.css'
//导入路由
import router from "./router";
import Mint from 'mint-ui';
import store from './store'
import 'mint-ui/lib/style.css';

import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import SliderVerificationCode from 'slider-verification-code'
import 'slider-verification-code/lib/slider-verification-code.css'

import VueResource from 'vue-resource';

import {isMobile} from '@/utils/common'
import * as rem from './config/rem'



Vue.use(SliderVerificationCode)
Vue.use(VueResource)
Vue.config.productionTip = false
Vue.use(Element);
if (isMobile()) {
  rem.rem();
  Vue.use(Mint);
}

// 页面刷新时，重新赋值token
if (sessionStorage.getItem('token')) {
  console.log('token',sessionStorage.getItem('token'))
  store.commit('set_token', sessionStorage.getItem('token'))
}

if (sessionStorage.getItem('userInfo')) {
  console.log('userInfo',sessionStorage.getItem('userInfo'))
  store.commit('set_userInfo', JSON.parse(sessionStorage.getItem('userInfo')))
}


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount('#app')
