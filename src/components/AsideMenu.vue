<template>
  <aside
      v-show="isAsideVisible"
      class="aside is-placed-left is-expanded">
    <div class="image">
      <router-link to="/">
        <img src="../assets/morchana-text.png" style="max-width:60%">
      </router-link>
    </div>
    <div class="menu is-menu-main">
      <aside-menu-list
          @menu-click="menuClick"
          :menu="menu"/>
    </div>
  </aside>
</template>

<script>
import { mapState } from 'vuex'
import AsideMenuList from '@/components/AsideMenuList'

export default {
  name: 'AsideMenu',
  components: { AsideMenuList },
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState([
      'isAsideVisible'
    ])
  },
  methods: {
    menuClick (item) {
      //
    }
  }
}
</script>
