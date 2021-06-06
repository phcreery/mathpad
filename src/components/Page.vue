<template>
<div :style="{height: '100%'}">
  <a-dropdown 
  :trigger="['contextmenu']"
  v-model="contextmenu"
  >
    <div class="graph-paper">

      <a-button @click="compute">Compute</a-button>

      <Node 
      v-for="(node) in storage.equations"
      ref="node"
      :key="node.id" 
      :formula="node.function" 
      :isselected="storage.activeEquations.includes(node.id) ? true : false"
      :x="node.x"
      :y="node.y"
      :id="node.id"
      :result="node.result"
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
      // Right Click Menu active?
      contextmenu: false,
      defaultEquation: {id: 0, x:0, y:0,  function: "", result: ""},
      mouseX: 0,
      mouseY: 0,
      // The "File" that is open
      storage: {
        activeEquations: [0], // by IDs
        equations: [
          // ID: { attributes }
          {id: 0, x:20, y:20, function: "f(y) \\coloneq 3 \\cdot y", result: ""},
          {id: 1, x:40, y:60,  function: "f(3)", result: ""},
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
      parent.contextmenu = false
      parent.mouseX = event.x
      parent.mouseY = event.y
      console.log("Mouse button:", event.pointerId, event.button, event.x) // clientX
      event.preventDefault()
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
      console.log('next', next)
      var newEquation = JSON.parse(JSON.stringify(this.defaultEquation))
      console.log(newEquation, this.defaultEquation)
      newEquation.id = next
      // newEquation.x = event.clientX - 80 // pageX
      // newEquation.y = event.clientY - 100
      newEquation.x = this.mouseX - 50 // pageX
      newEquation.y = this.mouseY- 90
      newEquation.function = "f(x):="
      this.storage.equations.push(newEquation)
      // this.storage.equations[this.storage.equations.length] = newEquation
      this.contextmenu = false
      // EventBus.$emit('focus', next)

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
        var val = calc.calculate(equation.function)
        console.log("Result:", val)
        equations[index].result = val
      })
    },
    deleteNode (id) {
      var index = this.storage.equations.findIndex((element) => element.id == id)
      if (index > -1) {
        this.storage.equations.splice(index, 1);
      }
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
