import Vue from 'vue';
import Vuetify from 'vuetify';

import 'vuetify/dist/vuetify.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import App from './App.vue';
import './assets/main.scss';

Vue.config.productionTip = false;
Vue.use(Vuetify, {
  iconfont: 'fa',
  theme: {
    primary: '#0096a9',
    secondary: '#d4e437',
    accent: '#ed7a3f',
  },
});
new Vue({
  render: h => h(App),
}).$mount('#app');

