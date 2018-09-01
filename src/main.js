import Vue from 'vue';
import Vuetify from 'vuetify';

import 'vuetify/dist/vuetify.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import colors from 'vuetify/es5/util/colors';
import App from './App.vue';
import './assets/main.scss';

Vue.config.productionTip = false;
Vue.use(Vuetify, {
  iconfont: 'fa',
  theme: {
    primary: colors.red.darken1, // #E53935
    secondary: colors.red.lighten4, // #FFCDD2
    accent: colors.indigo.base, // #3F51B5
  },
});
new Vue({
  render: h => h(App),
}).$mount('#app');

