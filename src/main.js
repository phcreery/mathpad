// import Vue from 'vue'
import Vue from 'vue/dist/vue.js'  // for mathlive? Standard use: use above
import App from './App.vue'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import VueKatex from 'vue-katex';
import 'katex/dist/katex.min.css';


// import MathLive from "https://unpkg.com/mathlive/dist/mathlive.min.mjs";
// import Mathfield from "https://unpkg.com/mathlive/dist/vue-mathlive.mjs";
// import * as MathLive from '/dist/mathlive.mjs';
//   import Mathfield from "./node_modules/mathlive/dist/vue-mathlive.mjs";
// import MathfieldComponent from '../../dist/vue-mathlive.mjs';
// import MathLive from "mathlive.js";
// import Mathfield from "mathlive/vue-mathlive.mjs";
import MathLive from "./input/mathlive/mathlive.min.mjs";
// import MathfieldComponent from "./mathlive/vue-mathlive.mjs";
var MathfieldComponent = require("./input/mathlive/vue-mathlive.mjs").default;

Vue.config.productionTip = false
Vue.config.devtools = true;

Vue.use(Antd);
Vue.use(MathfieldComponent, MathLive);
// Vue.use(MathLive);

Vue.use(VueKatex, {
  globalOptions: {
    //... Define globally applied KaTeX options here
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app')
