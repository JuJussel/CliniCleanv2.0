import Vue from 'vue'
import Router from 'vue-router'
import login from './views/login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('./views/home.vue')
    },
    {
      path: '/mobile',
      name: 'mobileLogin',
      component: () => import('./mobile/views/login_mobile.vue')
    },
    {
      path: '/mobile/home',
      name: 'mobileHome',
      component: () => import('./mobile/views/home_mobile.vue')
    }
  ]
})
