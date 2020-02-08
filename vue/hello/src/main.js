// Vue 최초 실행 파일

import Vue from "vue";
import App from "./App.vue";
import router from './router'

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
