<template>
  <div class="footer">
    <a-row type="flex" justify="space-between">
      <a-col :span="12">
      <a-space :style="{height: '36px'}">
        <div :style="{width: '20px'}"/>
        <!-- Auto Calculate -->
        <a-icon type="calculator" />
          <a-switch default-checked size="small" />
          </a-space>
      </a-col>
      <a-col>
        <a-space :style="{height: '36px'}">
          <!-- ScratchPad -->
          <a-icon type="export" />
          <a-switch default-checked size="small" />

          <div :style="{width: '20px'}"/>

          <a-icon type="zoom-out" />
          <a-slider id="test" :default-value="100" :style="{width: '100px', marginTop: '6px', marginBottom: '6px'}" />
          <a-icon type="zoom-in" />
          <div :style="{width: '20px'}"/>
          
        </a-space>
      </a-col>
    </a-row>

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
.footer{
  background: white;
  position: fixed;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: 36px;
  box-shadow: 0px 0px 5px 0.1px #ccc;
}
.ant-space-item {
  height: 24px !important;
}
</style>
