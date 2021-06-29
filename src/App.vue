<template>
  <div id="app">
    <a-layout>
      <Header />
      <!-- <a-layout> -->
      <!-- <Sider/> -->
      <!-- class="content dwgtable withscratchpad center"  -->
      <!-- :style="{ marginTop: this.mounted ? '0' : '110vh' }" -->
      <a-layout-content class="content dwgtable center" :class="{ withscratchpad: scratchpad }">
        <div :style="{ height: '100%' }">
          <File v-if="isFileOpen" :file="fileToUse" :key="remountticker" ref="file" />
          <FrontPage v-else />
          <!-- OPEN modal -->
          <a-modal v-model="openfilemodal" title="Open File" @ok="handleOpenOk">
            <a-textarea v-model="fileToUseString" :auto-size="{ minRows: 8, maxRows: 20 }" :style="{ marginBottom: '20px' }" />
            <a-upload-dragger name="file" :multiple="false" @change="handleUploadChange" :before-upload="beforeUpload">
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">
                Click or drag file to this area to upload
              </p>
            </a-upload-dragger>
          </a-modal>
          <!-- SAVE modal -->
          <a-modal v-model="savefilemodal" title="Save File" @ok="handleSaveOk">
            <a-textarea v-model="fileToUseString" :auto-size="{ minRows: 8, maxRows: 20 }" />
            <a-button type="primary" icon="download" size="large" block @click="download()">
              Download
            </a-button>
          </a-modal>
        </div>

        <a-button v-if="isFileOpen" type="dashed" block style="margin-top: 4px;" @click="addpage">
          Add Page
        </a-button>
      </a-layout-content>
      <!-- </a-layout> -->
      <Footer v-if="isFileOpen" />
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
      remountticker: 0,
      openfilemodal: false,
      savefilemodal: false,
      isFileOpen: false,
      fileToUse: undefined, // Object: the actual file in use passed into the Component
      // fileToOpen: '', // String: the file buffer when prompted to open a new file
      blankfile: {
        pages: 1,
        activeEquations: [0], // by IDs
        equations: []
      }
    }
  },
  mounted: function() {
    EventBus.$on('togglescratch', value => {
      this.scratchpad = value
    })
    EventBus.$on('promptopenfile', () => {
      console.log('opening...')
      // this.fileToOpen = JSON.stringify(this.fileToUse)
      this.openfilemodal = true
    })
    EventBus.$on('openfile', file => {
      // this.isFileOpen = false
      console.log('opening file', file)
      this.fileToUse = file
      this.remountticker += 1
      this.isFileOpen = true
    })
    EventBus.$on('promptnewfile', () => {
      if (this.isFileOpen) {
        let parent = this
        this.$confirm({
          title: 'Do you want to discard your current work?',
          // content: () => <div style="color:red;">Some descriptions</div>,
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            console.log('OK')
            console.log('newfile')
            parent.fileToUse = JSON.parse(JSON.stringify(parent.blankfile))
            parent.remountticker += 1
            parent.isFileOpen = true
          },
          onCancel() {
            console.log('Cancel')
          },
          class: 'test'
        })
      } else {
        console.log('newfile')
        this.fileToUse = JSON.parse(JSON.stringify(this.blankfile))
        this.remountticker += 1
        this.isFileOpen = true
      }
    })
    EventBus.$on('promptclosefile', () => {
      if (this.isFileOpen) {
        let parent = this
        this.$confirm({
          title: 'Do you want to discard your current work?',
          // content: () => <div style="color:red;">Some descriptions</div>,
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk() {
            console.log('OK')
            parent.isFileOpen = false
            parent.fileToUse = undefined
          },
          onCancel() {
            console.log('Cancel')
          },
          class: 'test'
        })
      } else {
        this.isFileOpen = false
        this.fileToUse = undefined
      }
    })
    EventBus.$on('promptsavefile', () => {
      this.fileToUse = this.$refs.file.storage
      this.savefilemodal = true
      this.download('mathpad.mp', JSON.stringify(this.fileToUse))
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
      // this.fileToUse = JSON.parse(this.fileToOpen)
      console.log('Opening', this.fileToUse)
      // this.file = this.blankfile
      this.openfilemodal = false
      this.remountticker += 1
      this.isFileOpen = true
    },
    handleUploadChange(event) {
      console.log('upload change', event)
    },
    beforeUpload(file) {
      // let name = file.name
      // let path = file.path
      // let size = file.size
      const reader = new FileReader()
      reader.addEventListener('load', event => {
        // console.log(event)
        // console.log(event.target.result)
        let blob = event.target.result
        let data = blob.split(',')
        let base64 = data[1]
        let string = atob(base64)
        console.log('File:', string)
        this.fileToUse = JSON.parse(string)
      })
      reader.readAsDataURL(file)
      return false // to prevent antd fron trying to upload somewhere
    },
    download(filename, text) {
      // defaults
      filename ? filename : 'mathpad.mp'
      text ? text : JSON.stringify(this.$refs.file.storage)

      var element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
      element.setAttribute('download', filename)

      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    }
  },
  filters: {
    toString(json) {
      return JSON.stringify(json)
    }
  },
  computed: {
    fileToUseString: {
      get() {
        console.log('getting string', JSON.stringify(this.fileToUse))
        return JSON.stringify(this.fileToUse)
      },
      set(value) {
        this.fileToUse = JSON.parse(value)
        console.log('setting string to', this.fileToUse)
      }
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
  /* A4 Letter Size */
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
