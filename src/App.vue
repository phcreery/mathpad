<template>
  <div id="app">
    <a-layout>
      <Header />
      <!-- <Sider/> -->
      <!-- class="content dwgtable withscratchpad center"  -->
      <!-- :style="{ marginTop: this.mounted ? '0' : '110vh' }" -->
      <a-layout-content class="content dwgtable center" :class="{ withscratchpad: scratchpad }">
        <div :style="{ height: '100%' }">
          <File v-if="fileOpen" :file="file" />
          <FrontPage v-else />
        </div>

        <a-button v-if="fileOpen" type="dashed" block style="margin-top: 4px;" @click="addpage">
          Add Page
        </a-button>
      </a-layout-content>
      <Footer />
    </a-layout>
  </div>
</template>

<script>
import File from './components/File.vue'
// import Sider from './components/Sider.vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import FrontPage from './components/FrontPage.vue'

import { EventBus } from './components/eventbus.js'

export default {
  name: 'App',
  components: {
    File,
    // Sider,
    Header,
    Footer,
    FrontPage
  },
  data() {
    return {
      scratchpad: false,
      fileOpen: false,
      file: {},
      blankfile: {
        pages: 1,
        activeEquations: [0], // by IDs
        equations: [
          // ID: { attributes }
        ]
      }
    }
  },
  mounted: function() {
    EventBus.$on('togglescratch', value => {
      this.scratchpad = value
    })
    EventBus.$on('openfile', file => {
      this.fileOpen = false
      this.file = file
      this.fileOpen = true
    })
    EventBus.$on('newfile', () => {
      this.fileOpen = false
      this.file = this.blankfile
      this.fileOpen = true
    })
  },
  methods: {
    addpage() {
      EventBus.$emit('addpage')
    }
  }
}
</script>

<style scoped>
.content {
  /* display: flex; */
  /* margin: 24px; */
  /* height: 100%; */
  margin-top: calc(24px + 36px);
  margin-bottom: calc(24px + 36px);
}
.dwgtable {
  /* transition: margin 700ms; */
  width: 21cm;
  min-height: 29.7cm;
  background: white;
  border: 0.5px solid rgb(212, 212, 212);
}
.withscratchpad {
  width: 90vw !important;
}
.center {
  margin-left: auto;
  margin-right: auto;
  /* border: 0.5px solid rgb(212, 212, 212); */
}
</style>

<style>
/* html, body {
  height: 100%;
} */
.page {
  /* A4 Letter */
  width: 21cm;
  /* width: 90vw; */
  min-height: 29.7cm;
  /* border: 1px solid rgb(212, 212, 212); */
  box-shadow: 0px 0px 8px 2px #ccc;
  overflow-x: revert !important;
  /* margin-bottom: 10px */
  /* background: white; */
}
</style>
