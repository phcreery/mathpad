<template>
  <div class="header">
    <!-- <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }"> -->
    <!-- <a-menu theme="light" mode="horizontal" :default-selected-keys="['2']" :style="{ lineHeight: '36px', paddingLeft: '20px' }">
      <a-sub-menu>
        <span slot="title" class="submenu-title-wrapper">File</span>
        <a-menu-item key="setting:1" @click="newfile()">
          New
        </a-menu-item>
        <a-menu-item key="setting:2">
          Open
        </a-menu-item>
        <a-menu-item key="setting:3">
          Save as...
        </a-menu-item>
      </a-sub-menu>
    </a-menu> -->

    <a-row type="flex" justify="space-between" :style="{ lineHeight: '36px', paddingLeft: '20px' }">
      <a-col :span="4">
        <a-space :style="{ height: '36px' }">
          <div :style="{ width: '10px' }" />
          <h3 style="margin 0;" @click="closefile()" :style="{ cursor: 'pointer' }">mathpad</h3>
          <div :style="{ width: '10px' }" />
          <!-- <a-button>File</a-button> -->
          <a-menu theme="light" mode="horizontal" :selectedKeys="[]" @select="() => {}" @click="() => {}" :selectable="false">
            <a-menu-item>
              <a-dropdown placement="bottomCenter">
                <a style="height: 36px;">File</a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a target="_blank" rel="noopener noreferrer" @click="promptnewfile()">New</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a target="_blank" rel="noopener noreferrer" @click="promptsavefile()">Save as...</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a target="_blank" rel="noopener noreferrer" @click="promptopenfile()">Open</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a target="_blank" rel="noopener noreferrer" @click="promptclosefile()">Close</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-menu-item>
          </a-menu>
        </a-space>
      </a-col>

      <a-col>
        <a-space :style="{ height: '36px' }">
          <div :style="{ width: '20px' }" />
        </a-space>
      </a-col>
    </a-row>

    <!-- </a-layout-header> -->
  </div>
</template>

<script>
import { EventBus } from './eventbus.js'

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
  methods: {
    promptnewfile() {
      EventBus.$emit('promptnewfile')
    },
    closefile() {
      EventBus.$emit('promptclosefile')
    },
    promptopenfile() {
      EventBus.$emit('promptopenfile')
    },
    promptsavefile() {
      EventBus.$emit('promptsavefile')
    },
    promptclosefile() {
      EventBus.$emit('promptclosefile')
    }
  },
  computed: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  position: fixed;
  z-index: 1;
  width: 100%;
  box-shadow: 0px 0px 5px 0.1px #ccc;
  background: rgb(255, 255, 255);
}
.ant-menu-horizontal {
  line-height: 36px !important;
}
</style>
