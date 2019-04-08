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

require('lodash')

Vue.use(new VueSocketIO({
  connection: SocketIO('https://192.168.11.99:1337')
}))
Vue.use(FullCalendar)

Vue.component('dateDisplay', dateDisplay)
Vue.component('draggable', draggable)
Vue.component('el-table-pag', tablePag)

Vue.config.productionTip = false
Vue.prototype.$eventHub = new Vue() // Global event bus
Vue.prototype.$moment = moment

// Requests Mixin
Vue.mixin(requests)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
