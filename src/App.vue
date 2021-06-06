<template>
  <div id="app">
    <a-layout style="height: 100vh">
      <a-layout-content :style="{ padding: '24px', height: '100%' }">
        <div :style="{ background: '#fff', height: '100%'}">
          <Page/>
        </div>
      </a-layout-content>

    </a-layout>
  </div>
</template>

<script>
import Page from './components/Page.vue'

export default {
  name: 'App',
  components: {
    Page
  }
}
</script>

<style>

</style>
