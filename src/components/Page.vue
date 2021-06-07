<template>
<div :style="{height: '100%'}">
  <a-dropdown 
  :trigger="contextmenutrigger"
  v-model="contextmenu"
  >
    <div class="graph-paper">
    
    <a-space>
      <a-button @click="compute">Compute</a-button>
      <a-select default-value="Decimal" style="width: 100px" @change="handleChangeNformat">
        <a-select-option value="decimals">
          Decimal
        </a-select-option>
        <a-select-option value="fractions">
          Fraction
        </a-select-option>
        <a-select-option value="recurring">
          Recurring
        </a-select-option>
      </a-select>
      <a-input-number v-if="mathOptions.numberformat == 'decimals'" id="inputNumber" style="width: 60px" v-model="mathOptions.decimals" :min="1" :max="10" />
      <a-select default-value="LaTeX" style="width: 100px" @change="handleChangeOUTformat">
        <a-select-option value="string">
          String
        </a-select-option>
        <a-select-option value="LaTeX">
          LaTeX
        </a-select-option>
      </a-select>
    </a-space>

      <Node 
      v-for="(node) in storage.equations"
      ref="node"
      class="node"
      :key="node.id" 
      :formula="node.function" 
      :isselected="storage.activeEquations.includes(node.id) ? true : false"
      :x="node.x"
      :y="node.y"
      :id="node.id"
      :result="node.result"
      :format="outputFormat"
      />

    </div>
    <a-menu slot="overlay">
      <a-menu-item key="1" @click="addnode">
        Add Equation
      </a-menu-item>
      <a-menu-item key="2" disabled>
        Add Text Box
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</div>

</template>

<script>
import Node from "./Node"
import { EventBus } from './eventbus.js'
import interact from 'interactjs'

const calc = require('../calc/calculator.js')

export default {
  name: 'Page',
  components: {
    Node
  },
  props: {
  },
  data () {
    return {
      contextmenu: false,
      contextmenutrigger: ['contextmenu'],
      defaultEquation: {id: 0, x:0, y:0,  function: "", result: ""},
      mouseX: 0,
      mouseY: 0,
      outputFormat: 'LaTeX',
      mathOptions: {
        numberformat: 'decimals',
        decimals: 5,
      },
      // The "File" that is open
      storage: {
        activeEquations: [0], // by IDs
        equations: [
          // ID: { attributes }
          {id: 0, x:20, y:20, function: "f(y) \\coloneq 3 \\cdot y", result: ""},
          {id: 1, x:20, y:60,  function: "f(3)", result: ""},
          {id: 2, x:20, y:100,  function: "3.7847*7.873222", result: ""},
          {id: 3, x:20, y:200,  function: "g:3", result: ""},
          {id: 4, x:20, y:240,  function: "g+3", result: ""},
          {id: 5, x:20, y:280,  function: "\\frac{4}{5}", result: ""},
          {id: 6, x:20, y:340,  function: "solve(4x=2,x)", result: ""},
          {id: 7, x:20, y:400,  function: "simplify((x^2+4*x-45)/(x^2+x-30))", result: ""},

          {id: 8, x:300, y:20,  function: "fib(15)", result: ""},
          {id: 9, x:300, y:60,  function: "\\sqrt{a^2 + b^2}", result: ""},
          {id: 10, x:300, y:100,  function: "integrate(sec(x)^2, x)", result: ""}, //\int\sec(x),dx
          {id: 11, x:300, y:140,  function: "\\int(\\sec(x)^2),dx", result: ""}, //\int\sec(x),dx
          {id: 12, x:300, y:200,  function: "abs(-2)", result: ""},
          {id: 13, x:300, y:240,  function: "\\operatorname{abs}(-2)", result: ""}, // \left|-3\right|
          {id: 14, x:300, y:280,  function: "\\left|-3\\right|  ", result: ""}, // \left|-3\right|
          {id: 15, x:400, y:280,  function: "|-3|  ", result: ""},
          {id: 16, x:300, y:320,  function: "round(2.56,1)", result: ""},
          {id: 17, x:300, y:360,  function: "\\operatorname{round}(2.56,1)", result: ""},
          
          {id: 18, x:600, y:20,  function: "lcm(3, 21)", result: ""},
          {id: 19, x:600, y:60,  function: "\\operatorname{lcm}(3, 21)", result: ""},
          {id: 20, x:600, y:100,  function: "factorial(13)", result: ""},
          {id: 21, x:600, y:140,  function: "13!", result: ""},

        ]
      }
    }
  },
  mounted: function () {
    var parent = this
    interact('.graph-paper')
    .pointerEvents({
      // ignoreFrom: '.mathfield',
      ignoreFrom: '.node',
    })
    .on('tap', function (event) {
      parent.storage.activeEquations = []
      parent.contextmenu = false
      parent.contextmenutrigger = ['contextmenu']
      parent.mouseX = event.x
      parent.mouseY = event.y
      // console.log("Mouse button:", event.pointerId, event.button, event.x) // clientX
      // event.preventDefault()
    })
    interact('.node')
    .on('tap', function () {
      console.log("shouldnt open")
      parent.contextmenu = false
      parent.contextmenutrigger = []
      // event.preventDefault()
      // event.stopPropagation()
    })
    EventBus.$on('selected', (id) => { this.selectNode(id) })
    EventBus.$on('changed', (changeinfo) => { this.changeNodeValue(changeinfo) })
    EventBus.$on('moved', (changeinfo) => { this.changeNodePosition(changeinfo) })
    EventBus.$on('delete', (id) => { this.deleteNode(id) })
  },
  methods: {
    selectNode(id) {
      console.log("Selecting", id)
      this.storage.activeEquations = [id]
    },
    changeNodeValue(changeInfo) {
      console.log("Changing", changeInfo)
      var index = this.storage.equations.findIndex((element) => element.id == changeInfo.id)
      console.log("Changing index", index)
      if (index >= 0) {
        this.storage.equations[index].function = changeInfo.to
      }
    },
    changeNodePosition(changeInfo) {
      console.log("Moving", changeInfo)
      var index = this.storage.equations.findIndex((element) => element.id == changeInfo.id)
      console.log("Moving index", index)
      if (index >= 0) {
        this.storage.equations[index].x = changeInfo.x
        this.storage.equations[index].y = changeInfo.y
      }
    },
    addnode() {
      // get next available ID
      var next = 1
      var inc = 1
      while(this.storage.equations.findIndex((element) => element.id == (next += inc)) > -1);
      console.log('next id', next)
      var newEquation = JSON.parse(JSON.stringify(this.defaultEquation))
      newEquation.id = next
      newEquation.x = this.mouseX - 50 // pageX
      newEquation.y = this.mouseY- 90
      // newEquation.function = "f(x):="
      this.storage.equations.push(newEquation)
      this.contextmenu = false
      this.storage.activeEquations = [next]
      // this.$emit('init') // optinal force update
      // some hackery to make sure the new component renderd before calling it
      setTimeout(() => { // setTimeout to put this into event queue
        // executed after render
        EventBus.$emit('focus', next)
      }, 0)
      console.log(this.storage.activeEquations)

    },
    deleteNode (id) {
      var index = this.storage.equations.findIndex((element) => element.id == id)
      if (index > -1) {
        this.storage.equations.splice(index, 1);
      }
    },
    handleChangeNformat(value) {
      this.mathOptions.numberformat = value
    },
    handleChangeOUTformat(value) {
      this.outputFormat = value
      this.compute()
    },
    compute () {
      // sort the equations be y position
      this.storage.equations.sort((a, b) => (a.y > b.y) ? 1 : (a.y === b.y) ? ((a.x > b.x) ? 1 : -1) : -1)
      this.storage.equations.forEach((equation, index, equations) => {
        // find the vue element with the same ID as the looped equation
        var nodeelement = this.$refs['node'].find(
            el => el.id === equation.id
        );
        // call the getValue function
        var ascii = JSON.parse(JSON.stringify(nodeelement.getValue("ascii-math")))
        console.log(ascii, equation.function, nodeelement)
        
        // var val = calc.calculate(ascii) // equation.function
        var val = calc.calculate(equation.function, this.mathOptions)
        console.log("Result:", val)
        if (this.outputFormat == 'string') {
          equations[index].result = val.text
        } else {
          equations[index].result = val.LaTeX
        }
        
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.graph-paper {
  --back-color: #fffcf154;
  --front-color: #BED1D354;
  width: 100%;
  height: 100%;
  background-color: var(--back-color);
  /* opacity: .4; */
  background-image: linear-gradient(var(--front-color) 2px, transparent 2px), linear-gradient(90deg, var(--front-color) 1px, transparent 2px), linear-gradient(var(--front-color) 0px, transparent 1px), linear-gradient(90deg, var(--front-color) 1px, var(--back-color) 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position: -4px -3px, -3px -4px, -2px -3px, -3px -2px;
  padding: 24px;
}
</style>
