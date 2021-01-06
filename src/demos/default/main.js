import Vue from 'vue'
import App from './index.vue'
import vg6 from '../../vg6/index.js'

Vue.config.productionTip = false
Vue.use(vg6)
new Vue({
  render: h => h(App),
}).$mount('#app')
