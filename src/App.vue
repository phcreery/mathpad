<template>
  <div id="app">
    <a-layout >
      <a-layout-content class="content page center">
        <div :style="{ background: '#fff', height: '100%'}" >
          <File/>
        </div>
        <a-button type="dashed" block style="margin-top: 4px;">
      Add Page
    </a-button>
      </a-layout-content>

    </a-layout>
  </div>
</template>

<script>
import File from './components/File.vue'

export default {
  name: 'App',
  components: {
    File
  }
}
</script>

<style scoped>
.content {
  /* display: flex; */
  /* margin: 24px; */
  /* height: 100%; */
  margin-top: 24px;
  margin-bottom: 24px;
}
.page {
  width: 21cm;
  min-height: 29.7cm;
}
.center {
  margin-left: auto;
  margin-right: auto;
  border: 0.5px solid rgb(212, 212, 212);
}
</style>

<style>
/* html, body {
  height: 100%;
} */
.page {
  width: 21cm;
  min-height: 29.7cm;
}
</style>
