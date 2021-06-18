<template>
  <div class="landing page">
    <div style="width: 100%; display: block; height: 50px;"></div>
    <a-row style="padding: 64px;" type="flex" justify="space-around">
      <a-col>
        <!-- <a-card hoverable style="width: 200px; margin-bottom: 20px;">
          <h1 style="text-align: center; ">New</h1>
        </a-card>
        <a-card hoverable style="width: 200px">
          <h1 style="text-align: center; ">Open</h1>
        </a-card> -->
        <a-button type="primary" size="large" @click="promptnewfile()" style="width: 200px; height: 100px;  margin-bottom: 20px;">
          <a-icon type="file-add" />
          New
        </a-button>
        <br />
        <a-button type="primary" size="large" @click="promptopenfile()" style="width: 200px; height: 100px;">
          <a-icon type="folder-open" />
          Open
        </a-button>
      </a-col>
      <a-col>
        <p>Open <a @click="openfile(exampleFile)">Example Sheet</a></p>
        <p>Read <a target="_blank" href="https://github.com/phcreery/mathpad">Documentation</a></p>
        <p>View <a target="_blank" href="https://github.com/phcreery/mathpad">Source Code</a></p>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { EventBus } from './eventbus.js'

export default {
  name: 'FrontPage',
  components: {},
  props: {},
  data() {
    return {
      mounted: false,
      exampleFile: {
        pages: 2,
        activeEquations: [0], // by IDs
        equations: [
          // ID: { attributes }
          { id: 0, x: 20, y: 20, function: 'f(y) \\coloneq 3 \\cdot y', result: '' },
          { id: 1, x: 20, y: 60, function: 'f(3)', result: '' },
          { id: 2, x: 20, y: 100, function: '3.7847*7.873222', result: '' },
          { id: 3, x: 20, y: 200, function: 'g:3', result: '' },
          { id: 4, x: 20, y: 240, function: 'g+3', result: '' },
          { id: 5, x: 20, y: 280, function: '\\frac{4}{5}', result: '' },
          { id: 6, x: 20, y: 340, function: 'solve(4x=2,x)', result: '' },
          { id: 7, x: 20, y: 400, function: 'simplify((x^2+4*x-45)/(x^2+x-30))', result: '' },

          { id: 8, x: 300, y: 20, function: 'fib(15)', result: '' },
          { id: 9, x: 300, y: 60, function: '\\sqrt{a^2 + b^2}', result: '' },
          { id: 10, x: 300, y: 100, function: 'integrate(sec(x)^2, x)', result: '' },
          { id: 11, x: 300, y: 140, function: '\\int(\\sec(x)^2),dx', result: '' },
          { id: 12, x: 300, y: 200, function: 'abs(-2)', result: '' },
          { id: 13, x: 300, y: 240, function: '\\operatorname{abs}(-2)', result: '' },
          { id: 14, x: 300, y: 280, function: '\\left|-3\\right|  ', result: '' },
          { id: 15, x: 400, y: 280, function: '|-3|  ', result: '' }, // error but OK
          { id: 16, x: 300, y: 320, function: 'round(2.56,1)', result: '' },
          { id: 17, x: 300, y: 360, function: '\\operatorname{round}(2.56,1)', result: '' },

          { id: 18, x: 600, y: 20, function: 'lcm(3, 21)', result: '' },
          { id: 19, x: 600, y: 60, function: '\\operatorname{lcm}(3, 21)', result: '' },
          { id: 20, x: 600, y: 100, function: 'factorial(4)', result: '' },
          { id: 21, x: 600, y: 140, function: '4!', result: '' },
          { id: 22, x: 20, y: 460, function: 'diff(cos(x)*sin(x), x)', result: '' },
          { id: 23, x: 20, y: 500, function: 'diff(x^3+a*x^3+x^2, x, 2)', result: '' },

          { id: 24, x: 600, y: 460, function: 'g(x) \\coloneq 2 \\cdot x^{20}', result: '' },
          { id: 25, x: 600, y: 500, function: '\\frac{\\differentialD g(x)}{\\differentialD x}', result: '' }, // error d(g(x))/d(x)
          { id: 26, x: 20, y: 540, function: 'laplace(t^6, t, s)', result: '' },

          { id: 27, x: 20, y: 580, function: 'defint(sin(x), 0, \\pi)', result: '' },
          { id: 28, x: 300, y: 580, function: '\\int_0^\\pi(\\sin(x)),dx', result: '' }, // error
          { id: 29, x: 600, y: 580, function: '\\int_{0}^{\\pi}(\\sin(x)),dx', result: '' }, // error
          { id: 30, x: 20, y: 140, function: '3.7847\\cdot7.873222', result: '' }, // error

          { id: 31, x: 20, y: 640, function: 'snells(n,t,nn)\\coloneq\\frac{n\\cdot(\\sin(t))}{nn}', result: '' },
          // snells(n,t,nn)\\coloneq\\frac{n\\cdot(\\sin(t))}{nn}
          // snells(n_1,\\theta_1,n_2)\\coloneq\\frac{n_1\\cdot\\sin(\\theta_1)}{n_2}
          { id: 32, x: 20, y: 690, function: 'degrees(snells(1,radians(45),1.5))', result: '' }
        ]
      }
    }
  },
  mounted: function() {
    this.mounted = true
  },
  beforeDestroy() {},
  methods: {
    promptopenfile(file) {
      EventBus.$emit('promptopenfile', file)
    },
    openfile(file) {
      EventBus.$emit('openfile', file)
    },
    promptnewfile() {
      EventBus.$emit('promptnewfile')
    }
  },
  computed: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.landing {
  /* background: white;
  min-height: 50vh;
  box-shadow: 0px 0px 5px 0.1px #ccc; */
}
</style>
