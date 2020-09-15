<template>
  <div>
  </div>
  <!--
  <footer v-show="isFooterBarVisible" class="footer">
    <div class="container-fluid">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <div>
              <b>{{ year }} Morchana.in.th</b> <span class="tag">ช่วยกัน</span>
            </div>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="logo">
              <a href="https://www.morchana.in.th">
                <img src="../assets/logo.png" alt="Morchana"/>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
  -->
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  name: 'FooterBar',
  computed: {
    year () {
      return moment().year()
    },
    ...mapState([
      'isFooterBarVisible'
    ])
  }
}
</script>
