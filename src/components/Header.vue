<template>
  <div class="header" >
    <!-- <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }"> -->
      <a-menu
        theme="light"
        mode="horizontal"
        :default-selected-keys="['2']"
        :style="{ lineHeight: '36px', paddingLeft: '20px' }"
      >

        <a-sub-menu>
          <span slot="title" class="submenu-title-wrapper"
            >File</span
          >
            <a-menu-item key="setting:1">
              New
            </a-menu-item>
            <a-menu-item key="setting:2">
              Open
            </a-menu-item>
            <a-menu-item key="setting:3">
              Save as...
            </a-menu-item>
        </a-sub-menu>

      </a-menu>

      
    <!-- </a-layout-header> -->
  </div>
</template>

<script>
// import { EventBus } from './eventbus.js'

export default {
  name: 'Page',
  components: {
  },
  props: {
  },
  data () {
    return {
      scrollPosition: null,
      outputFormat: 'LaTeX',
      mathOptions: {
        numberformat: 'decimals',
        decimals: 5,
      },
    }
  },
  mounted: function () {
    
  },
  beforeDestroy () {

  },
  methods: {
    
  },
  computed: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  position: fixed;
  z-index: 1;
  width: 100%;
  box-shadow: 0px 0px 5px 0.1px #ccc;
}
</style>
