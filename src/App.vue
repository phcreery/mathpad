<template>
  <div id="app">
    <a-layout>
      <Header />
      <!-- <Sider/> -->
      <!-- class="content dwgtable withscratchpad center"  -->
      <!-- :style="{ marginTop: this.mounted ? '0' : '110vh' }" -->
      <a-layout-content class="content dwgtable center" :class="{ withscratchpad: scratchpad }">
        <div :style="{ height: '100%' }">
          <File v-if="file" :file="file" :key="remountticker" />
          <FrontPage v-else />
          <a-modal v-model="openfilemodal" title="Open File" @ok="handleOpenOk">
            <a-textarea v-model="filetoopen" :auto-size="{ minRows: 8, maxRows: 20 }" />
          </a-modal>
          <a-modal v-model="savefilemodal" title="Save File" @ok="handleSaveOk">
            <a-textarea v-model="filetoopen" :auto-size="{ minRows: 8, maxRows: 20 }" />
          </a-modal>
        </div>

        <a-button v-if="file" type="dashed" block style="margin-top: 4px;" @click="addpage">
          Add Page
        </a-button>
      </a-layout-content>
      <Footer v-if="file" />
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
      // fileOpen: false,
      remountticker: 0,
      openfilemodal: false,
      savefilemodal: false,
      file: undefined,
      filetoopen: `{
  "pages": 1,
  "activeEquations": [0],
  "equations": [
  ]
}
`,
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
    EventBus.$on('promptopenfile', () => {
      console.log('opening...')
      this.openfilemodal = true
    })
    EventBus.$on('openfile', file => {
      // this.fileOpen = false
      this.file = file
      this.remountticker += 1
      // this.fileOpen = true
    })
    EventBus.$on('promptnewfile', () => {
      console.log('newfile')
      // this.fileOpen = false
      this.file = undefined
      console.log('done with new file?', this.remountticker, this.file == undefined)
      this.$nextTick(() => {
        // Add the component back in
        this.file = this.blankfile
        this.remountticker += 1

        console.log('done with new file?', this.remountticker, this.file == undefined)
      })
      // console.log(this.file, this.blankfile)
      // this.remountticker += 1
      // this.fileOpen = true
    })
    EventBus.$on('promptclosefile', () => {
      // this.fileOpen = false
      this.file = undefined
    })
    EventBus.$on('promptsavefile', () => {
      // this.fileOpen = false
      // this.file = {}
      this.savefilemodal = true
    })
  },
  methods: {
    addpage() {
      EventBus.$emit('addpage')
    },
    handleSaveOk() {
      this.savefilemodal = false
    },
    handleOpenOk() {
      this.file = JSON.parse(this.filetoopen)
      console.log('Opening', this.file)
      // this.file = this.blankfile
      this.openfilemodal = false
      this.fileOpen = true
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
