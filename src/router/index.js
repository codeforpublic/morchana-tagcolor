import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// import login from '../views/login.vue'
// import Logout from '../views/Logout.vue'

Vue.use(VueRouter)

const routes = [
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard'
    },
    path: '/',
    name: 'home',
    component: Home
  },
  // {
  //   // Document title tag
  //   // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
  //   meta: {
  //     title: 'Logout'
  //   },
  //   path: '/logout',
  //   name: 'logout',
  //   component: Logout
  // },
  // {
  //   // Document title tag
  //   // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
  //   meta: {
  //     title: 'Login'
  //   },
  //   path: '/login',
  //   name: 'login',
  //   component: login
  // },
  // {
  //   meta: {
  //     title: 'search'
  //   },
  //   path: '/search',
  //   name: 'search',
  //   // route level code-splitting
  //   // this generates a separate chunk (search.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "search" */ '../views/search.vue')
  // },
  // {
  //   meta: {
  //     title: 'badge'
  //   },
  //   path: '/badge',
  //   name: 'badge',
  //   // route level code-splitting
  //   // this generates a separate chunk (badge.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "badge" */ '../views/badge.vue')
  // },
  {
    meta: {
      title: 'badge import'
    },
    path: '/badge-import',
    name: 'badge-import',
    // route level code-splitting
    // this generates a separate chunk (badge-import.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "badge-import" */ '../views/badge-import.vue')
  },
  {
    meta: {
      title: 'badge log'
    },
    path: '/badge-log',
    name: 'badge-log',
    // route level code-splitting
    // this generates a separate chunk (badge-log.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "badge-log" */ '../views/badge-log.vue')
  },
  {
    meta: {
      title: 'Tag List'
    },
    path: '/tag',
    name: 'tag',
    // route level code-splitting
    // this generates a separate chunk (tag.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tag" */ '../views/tag.vue')
  }
  // {
  //   meta: {
  //     title: 'User List'
  //   },
  //   path: '/user',
  //   name: 'user',
  //   // route level code-splitting
  //   // this generates a separate chunk (user.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "user" */ '../views/user.vue')
  // }
  // {
  //   meta: {
  //     title: 'tag-user'
  //   },
  //   path: '/tag-user',
  //   name: 'tag-user',
  //   // route level code-splitting
  //   // this generates a separate chunk (tag-user.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "tag-user" */ '../views/tag-user.vue')
  // },
  // {
  //   meta: {
  //     title: 'Tables'
  //   },
  //   path: '/tables',
  //   name: 'tables',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "tables" */ '../views/Tables.vue')
  // },
  // {
  //   meta: {
  //     title: 'Forms'
  //   },
  //   path: '/forms',
  //   name: 'forms',
  //   component: () => import(/* webpackChunkName: "forms" */ '../views/Forms.vue')
  // },
  // {
  //   meta: {
  //     title: 'Profile'
  //   },
  //   path: '/profile',
  //   name: 'profile',
  //   component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
