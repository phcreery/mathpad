<template>
  <div class="graph-paper">
    <!-- Page1 -->

    <button v-on:click="compute">Compute</button>

    <Node 
    v-for="(node) in storage.equations" 
    :key="node.id" 
    :formula="node.function" 
    :isselected="storage.activeEquations.includes(node.id) ? true : false"
    :x="node.x"
    :y="node.y"
    :id="node.id"
    :result="node.result"
    />

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
      formula: "f(x)=",
      storage: {
        activeEquations: [0], // by IDs
        equations: [
          // ID: { attributes }
          {id: 0, x:10, y:10, function: "f(y):=3*y", result: ""},
          {id: 1, x:30, y:50,  function: "f(3)", result: ""},
          {id: 2, x:60, y:70,  function: "3*7", result: ""},
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
      event.preventDefault()
    })
    EventBus.$on('selected', (id) => { this.selectNode(id) })
    EventBus.$on('changed', (changeinfo) => { this.changeNodeValue(changeinfo) })
    EventBus.$on('moved', (changeinfo) => { this.changeNodePosition(changeinfo) })
  },
  methods: {
    setIt: function () {
      console.log("Setting")
      this.formula = 'y=-b\\pm \\frac {\\sqrt{b^2-4ac}}{2a}';
    },
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
    compute () {
      console.log("Before sort and Compute", this.storage.equations)
      // sort the equations be y position
      this.storage.equations.sort((a, b) => (a.y > b.y) ? 1 : (a.y === b.y) ? ((a.x > b.x) ? 1 : -1) : -1)
      this.storage.equations.forEach((equation, index, equations) => {
        console.log(equation.function)
        var val = calc.calculate(equation.function)
        console.log("Result:", val)
        equations[index].result = val
      })
      console.log("After", this.storage.equations)
      
    }
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
