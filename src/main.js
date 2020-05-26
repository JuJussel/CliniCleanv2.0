import globals from './globals'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import requests from './mixins/requests'
import SocketIO from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import './plugins/element.js'
import 'element-ui/lib/theme-ju/index.css'
import '@fortawesome/fontawesome-free/css/all.css'
import dateDisplay from './components/shared/date_display'
import draggable from 'vuedraggable'
import moment from 'moment'
import FullCalendar from 'vue-full-calendar'
import 'fullcalendar/dist/fullcalendar.min.css'
import 'fullcalendar/dist/locale/ja'
import tablePag from './components/shared/table_pag'
import VueCroppie from 'vue-croppie';
import 'croppie/croppie.css'

require('lodash')

Vue.use(new VueSocketIO({
  connection: SocketIO(globals.socketIOIP)
}))
Vue.use(FullCalendar)
Vue.use(VueCroppie)

Vue.component('dateDisplay', dateDisplay)
Vue.component('draggable', draggable)
Vue.component('el-table-pag', tablePag)

Vue.config.productionTip = false
Vue.prototype.$eventHub = new Vue() // Global event bus
Vue.prototype.$moment = moment
Vue.prototype.$globals = globals

// Requests Mixin
Vue.mixin(requests)

//$moment.locale('ja');

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
