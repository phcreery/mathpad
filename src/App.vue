<template>
  <div id="app">
    <a-layout >
      <Header/>
      <!-- <Sider/> -->
      <a-layout-content class="content dwgtable center">
        <div :style="{ height: '100%'}" >
          <File/>
        </div>
        <!-- <a-button type="dashed" block style="margin-top: 4px;">
          Add Page
        </a-button> -->
      </a-layout-content>
      <Footer/>
    </a-layout>
  </div>
</template>

<script>
import File from './components/File.vue'
// import Sider from './components/Sider.vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'


export default {
  name: 'App',
  components: {
    File,
    // Sider,
    Header,
    Footer
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
  width: 21cm;
  min-height: 29.7cm;
  background: white;
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
  width: 21cm;
  min-height: 29.7cm;
  /* border: 1px solid rgb(212, 212, 212); */
  box-shadow: 0px 0px 8px 2px #ccc;
  overflow-x: revert !important;
  /* margin-bottom: 10px */
  /* background: white; */
}
</style>
