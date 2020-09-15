<template>
  <div id="app">
    <div v-if="uiLogin === 'hide'">
      <nav-bar />
      <aside-menu :menu="menu" />
      <router-view />
      <footer-bar />
      <b-notification :closable="false">
        <b-loading
          :is-full-page="true"
          :active.sync="isLoading"
          :can-cancel="false"
        ></b-loading>
      </b-notification>
    </div>
    <div v-else>
      <div class="columns is-gapless">
        <div class="column has-text-centered">
          <!-- <img src="./assets/morchana-logo.png" style="max-width:320px" /> -->
          <img
            src="https://i2.wp.com/www.iurban.in.th/wp-content/uploads/2020/04/LOGO-MOR-CHANA.jpg?resize=770%2C770&ssl=1"
            style="max-width:320px"
          />
          <div style="padding-bottom:2em">
            <div style="font-weight:bold; font-size:2em">MORCHANA-ADMIN</div>
            <small>{{ getVersion() }}</small>
          </div>
        </div>
        <div class="column">
          <div style="margin:0 30px">
            <div class="card" v-show="uiShow === ''">
              <header class="card-header">
                <p class="card-header-title">
                  Sign-in
                </p>
              </header>
              <div class="card-content">
                <b-field label="Email">
                  <b-input type="email" v-model="frm.user"> </b-input>
                </b-field>
                <b-field label="Password">
                  <b-input type="password" v-model="frm.pass"> </b-input>
                </b-field>
                <b-field>
                  <b-button @click="doSignin" class="button is-primary"
                    >Sign in</b-button
                  >
                  <b-button @click="doForgot" class="button" type="is-text"
                    >Forgot password</b-button
                  >
                </b-field>
                <p class="control" style="color:red">{{ resultMessage1 }}</p>
              </div>
            </div>

            <div class="card" v-show="uiShow === 'changepassword'">
              <header class="card-header">
                <p class="card-header-title">
                  Change Password
                </p>
              </header>
              <div class="card-content">
                <b-field label="New Password">
                  <b-input type="password" v-model="frm.newpass1" required>
                  </b-input>
                </b-field>
                <b-field label="Confirm Password">
                  <b-input type="password" v-model="frm.newpass2" required>
                  </b-input>
                </b-field>
                <b-field>
                  <b-button @click="doChangePassword" class="button is-danger"
                    >Change Password</b-button
                  >
                  <b-button @click="uiShow = ''" class="button" type="is-text"
                    >Back</b-button
                  >
                </b-field>
                <p class="control" style="color:red">
                  {{ resultMessage2 }}
                </p>
              </div>
            </div>

            <div class="card" v-show="uiShow === 'forgot'">
              <header class="card-header">
                <p class="card-header-title">
                  Forgot Password
                </p>
              </header>
              <div class="card-content">
                <b-field label="Email">
                  <b-input
                    type="email"
                    v-model="frm.user"
                    required
                    :disabled="uiShow2 === 'forgot' ? true : false"
                  >
                  </b-input>
                </b-field>
                <div v-if="uiShow2 === 'forgot'">
                  <b-field label="Verification Code">
                    <b-input type="number" v-model="frm.code" required>
                    </b-input>
                  </b-field>
                  <b-field label="New Password">
                    <b-input type="password" v-model="frm.newpass1" required>
                    </b-input>
                  </b-field>
                  <b-field label="Confirm Password">
                    <b-input type="password" v-model="frm.newpass2" required>
                    </b-input>
                  </b-field>
                  <b-button @click="doResetCode" class="button is-warning"
                    >Submit</b-button
                  >
                  <b-button @click="uiShow = ''" class="button" type="is-text"
                    >Back</b-button
                  >
                  <div style="padding:6px 0 0 12px; color:red">
                    {{ resultMessage3 }}
                  </div>
                </div>
                <div v-else>
                  <b-field>
                    <b-button @click="doResetPassword" class="button is-warning"
                      >Reset password</b-button
                    >
                    <b-button @click="uiShow = ''" class="button" type="is-text"
                      >Back</b-button
                    >
                    <div style="padding:6px 0 0 12px; color:red">
                      {{ resultMessage2 }}
                    </div>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
<script>
import { Auth } from 'aws-amplify'
import NavBar from '@/components/NavBar'
import AsideMenu from '@/components/AsideMenu'
import FooterBar from '@/components/FooterBar'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      // uiLogin: '',
      resultMessage1: '',
      resultMessage2: '',
      resultMessage3: '',
      uiShow: '',
      uiShow2: '',
      isLoading: true,
      frm: {
        user: '',
        pass: '',
        newpass1: '',
        newpass2: '',
        code: ''
      }
    }
  },
  components: { FooterBar, AsideMenu, NavBar },
  watch: {
    $route (to, from) {
      // react to route changes...
    },
    uiLogin (to, from) {
      // console.log(to)
      if (to === 'show') {
        this.isLoading = false
      } else if (to === 'hide') {
        this.isLoading = false
      } else {
        this.isLoading = true
      }
    }
    // userName (to, from) {
    //   console.log('watch-user')
    //   if (to) {
    //     this.uiLogin = 'hide'
    //     this.isLoading = false
    //   } else {
    //     this.uiLogin = 'show'
    //     this.isLoading = false
    //   }
    // }
  },
  methods: {
    async doResetCode () {
      const self = this
      if (self.frm.newpass1.length > 0 && self.frm.newpass1 === self.frm.newpass2) {
        self.resultMessage3 = ''
        Auth.forgotPasswordSubmit(self.frm.user, self.frm.code, self.frm.newpass2)
          .then(data => {
            self.uiShow = ''
            self.frm.pass = ''
            self.frm.newpass1 = ''
            self.frm.newpass2 = ''
            self.frm.code = ''
            self.$buefy.snackbar.open({
              message: 'Change password success, please sign-in again',
              queue: false
            })
          })
          .catch(err => {
            if (err.code === 'ExpiredCodeException') {
              self.uiShow2 = ''
              self.frm.pass = ''
              self.frm.newpass1 = ''
              self.frm.newpass2 = ''
              self.frm.code = ''
              self.$buefy.snackbar.open({
                message: err.message,
                queue: false
              })
            } else {
              self.resultMessage3 = err.message
            }
          })
      } else {
        self.resultMessage3 = 'New password does not match'
      }
    },
    async doResetPassword () {
      const self = this
      Auth.forgotPassword(self.frm.user)
        .then(data => {
          self.uiShow2 = 'forgot'
          self.$buefy.snackbar.open({
            message: 'Verification code is sent to ' + self.frm.user,
            queue: false
          })
        })
        .catch(err => {
          self.$buefy.snackbar.open({
            message: err.message,
            queue: false
          })
        })
    },
    async doForgot () {
      this.frm.code = ''
      this.frm.newpass1 = ''
      this.frm.newpass2 = ''
      this.uiShow = 'forgot'
      this.uishow2 = ''
    },
    async doSignin () {
      const self = this
      try {
        const user = await Auth.signIn(this.frm.user, this.frm.pass)
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          // const userData = {
          //   name: user.challengeParam.userAttributes.email,
          //   email: user.challengeParam.userAttributes.email,
          //   // avatar: '',
          //   role: 'ADMIN',
          //   uiLogin: 'hide'
          //   // accessToken: 'user.idToken.jwtToken',
          //   // accessToken: user.signInUserSession.idToken.jwtToken
          // }
          self.uiShow = 'changepassword'
          self.$buefy.snackbar.open({
            message: 'You password is expired. Please change password',
            queue: false
          })
        } else {
          self.uiShow = ''
          const userData = {
            name: user.attributes.email,
            email: user.attributes.email,
            // avatar: '',
            role: 'ADMIN',
            uiLogin: 'hide'
            // accessToken: 'user.idToken.jwtToken',
            // accessToken: user.signInUserSession.idToken.jwtToken
          }
          self.$store.commit('user', userData)
        }
      } catch (error) {
        const userData = {
          name: null,
          email: null,
          // avatar: '',
          role: null,
          uiLogin: null
        }
        self.$store.commit('user', userData)
        self.resultMessage1 = error.message
      }
    },
    async doChangePassword () {
      const self = this
      self.resultMessage2 = ''
      if (self.frm.newpass1 === self.frm.newpass2 && self.frm.pass.length > 0 && self.frm.newpass1.length > 0) {
        Auth.signIn(self.frm.user, self.frm.pass)
          .then(user => {
            if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
              // const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
              Auth.completeNewPassword(
                user, // the Cognito User Object
                self.frm.newpass1 // the new password
                // OPTIONAL, the required attributes
                // {
                //   email: 'xxxx@example.com',
                //   phone_number: '1234567890'
                // }
              ).then(user => {
                self.$buefy.snackbar.open({
                  message: 'Change new password success, please sign-in again',
                  queue: false
                })
                self.uiShow = ''
                self.frm.pass = ''
                self.frm.newpass1 = ''
                self.frm.newpass2 = ''
              }).catch(e => {
                self.resultMessage2 = e.message
              })
            } else {
              self.resultMessage2 = 'Invalid New password'
            }
          }).catch(e => {
            self.resultMessage2 = e.message
          })
      } else {
        self.resultMessage2 = 'New password not match'
      }
    },
    getVersion () {
      // set version in index.html
      return window.LATEST_VERSION
    }
  },
  computed: {
    ...mapState(['userName', 'uiLogin', 'userRole']),
    menu () {
      const self = this
      let menuList = []
      if (self.userRole === 'ADMIN') {
        menuList = [
          {
            to: '/',
            icon: 'desktop-mac',
            label: 'Dashboard'
          },
          {
            to: '/tag',
            label: 'Tag List',
            icon: 'table',
            updateMark: false
          },
          {
            to: '/badge-import',
            label: 'Import Excel',
            icon: 'table',
            updateMark: true
          },
          {
            to: '/badge-log',
            label: 'Import Log',
            icon: 'table'
          }
        ]
      } else {
        menuList = [
          {
            to: '/',
            icon: 'desktop-mac',
            label: 'Dashboard'
          }
        ]
      }
      return menuList
    }
  }
}
</script>
