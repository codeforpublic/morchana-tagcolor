/* Styles */
import '@/scss/main.scss'
import '@mdi/font/css/materialdesignicons.css'

/* Core */
import Vue from 'vue'
import Buefy from 'buefy'

/* Router & Store */
import router from './router'
import store from './store'

/* Service Worker */
import './registerServiceWorker'

/* Vue. Main component */
import App from './App.vue'

import axios from 'axios'
import vueXlsxTable from 'vue-xlsx-table'

// import Amplify, { Auth } from 'aws-amplify'
import Amplify, { Auth, API } from 'aws-amplify'
// import Amplify from 'aws-amplify'
import awsconfig from './aws-exports'
import '@aws-amplify/ui-vue'
Amplify.configure(awsconfig)
API.configure()
Vue.prototype.$API = API

Vue.use(vueXlsxTable, { rABS: false })

Vue.prototype.$axios = axios
Vue.prototype.$axios.defaults.baseURL =
  // 'http://localhost:5001/morchana-admin/us-central1/api'
  'https://undl95x1fl.execute-api.ap-southeast-1.amazonaws.com/prod'

/* Default title tag */
const defaultDocumentTitle = 'Morchana Admin'

// API.configure()
Auth.currentAuthenticatedUser({
  bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
})
  .then(user => {
    const userData = {
      name: user.attributes.email,
      email: user.attributes.email,
      // avatar: '',
      role: 'ADMIN',
      uiLogin: 'hide'
      // accessToken: 'user.idToken.jwtToken',
      // accessToken: user.signInUserSession.idToken.jwtToken
    }
    // console.log(userData)
    store.commit('user', userData)
  })
  .catch(() => {
    const userData = {
      name: null,
      email: null,
      // avatar: '',
      role: null,
      uiLogin: null
    }
    store.commit('user', userData)
  })

/* Collapse mobile aside menu on route change & set document title from route meta */
router.afterEach(to => {
  store.commit('asideMobileStateToggle', false)

  if (to.meta.title) {
    document.title = `${to.meta.title} - ${defaultDocumentTitle}`
  } else {
    document.title = defaultDocumentTitle
  }
})

Vue.config.productionTip = false

Vue.use(Buefy)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
