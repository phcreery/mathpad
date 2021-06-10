<template>
  <div>
    <!-- <a-layout-sider > -->
    <!-- <div class="logo" /> -->
    <a-menu theme="dark" mode="inline" :default-selected-keys="['4']">
      <a-menu-item key="1">
        <a-icon type="user" />
        <span class="nav-text">nav 1</span>
      </a-menu-item>
      <a-menu-item key="2">
        <a-icon type="video-camera" />
        <span class="nav-text">nav 2</span>
      </a-menu-item>
      <a-menu-item key="3">
        <a-icon type="upload" />
        <span class="nav-text">nav 3</span>
      </a-menu-item>
      <a-menu-item key="4">
        <a-icon type="bar-chart" />
        <span class="nav-text">nav 4</span>
      </a-menu-item>
      <a-menu-item key="5">
        <a-icon type="cloud-o" />
        <span class="nav-text">nav 5</span>
      </a-menu-item>
      <a-menu-item key="6">
        <a-icon type="appstore-o" />
        <span class="nav-text">nav 6</span>
      </a-menu-item>
      <a-menu-item key="7">
        <a-icon type="team" />
        <span class="nav-text">nav 7</span>
      </a-menu-item>
      <a-menu-item key="8">
        <a-icon type="shop" />
        <span class="nav-text">nav 8</span>
      </a-menu-item>
    </a-menu>
    <!-- </a-layout-sider> -->
  </div>
</template>

<script>
// import { EventBus } from './eventbus.js'

export default {
  name: 'Page',
  components: {},
  props: {},
  data() {
    return {
      scrollPosition: null,
      outputFormat: 'LaTeX',
      mathOptions: {
        numberformat: 'decimals',
        decimals: 5
      }
    }
  },
  mounted: function() {},
  beforeDestroy() {},
  methods: {},
  computed: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
