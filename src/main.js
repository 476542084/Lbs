import Vue from 'vue'
import App from './App.vue'
import '@/static/style/base.css'
//导入路由
import router from "./router";
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import VueResource from 'vue-resource';



Vue.use(Mint);
Vue.use(VueResource);
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App)
}).$mount('#app')
