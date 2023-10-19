import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import axios from 'axios';
import VueAxios from 'vue-axios'

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Import component
import BaseCard from './components/UI/BaseCard.vue';

import component from './domain/component/component';
import componentHeader from './domain/component/componentHeader';
import componentService from './domain/component/componentService';

import operation from './domain/operation/operation';
import operationHeader from './domain/operation/operationHeader';
import operationService from './domain/operation/operationService';

import user from './domain/user/user';
import userHeader from './domain/user/userHeader';
import userService from './domain/user/userService';

Vue.prototype.$component = component;
Vue.prototype.$componentHeader = componentHeader;
Vue.prototype.$componentService = componentService;

Vue.prototype.$operation = operation;
Vue.prototype.$operationHeader = operationHeader;
Vue.prototype.$operationService = operationService;

Vue.prototype.$user = user;
Vue.prototype.$userHeader = userHeader;
Vue.prototype.$userService = userService;

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

// Registering Component
Vue.component('base-card', BaseCard)

Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
