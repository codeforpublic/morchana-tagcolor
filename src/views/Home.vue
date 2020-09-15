<template>
  <section class="section">
    <div v-if="userRole === 'ADMIN'">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            ขั้นตอนการใช้งาน
          </p>
        </header>
        <div class="card-content" style="line-height:3em">
          <p>1. สร้าง <code>tagId</code> ที่ต้องการใช้งานที่เมนู <router-link to="/tag" class="button is-primary">Tag List</router-link>
          </p>
          <p>
            2. เตรียมไฟล์ Excel ตามตัวอย่างในหน้า <router-link to="/badge-import" class="button is-primary">Import Excel</router-link> (sheet1) แล้วนำไปอัพโหลด
          </p>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            ขั้นตอนการขอสิทธิ์ใช้งาน
          </p>
        </header>
        <div class="card-content" style="line-height:3em">
          <p>กรุณาติดต่อ คุณโป้ง <code>sila.enc@gmail.com</code> เพื่อเปิดสิทธิ์การใช้งาน</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import { mapState } from 'vuex'

export default {
  name: 'home',
  data () {
    return {
      resultMessage: ''
    }
  },
  computed: {
    ...mapState([
      'userName',
      'userRole'
    ])
  },
  mounted () {
    // this.$buefy.snackbar.open({
    //   message: 'Welcome back',
    //   queue: false
    // })
  }
}
</script>
