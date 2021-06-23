<template>
  <div :style="{ height: '100%' }" class="">
    <div v-for="(page, index) in storage.pages" :key="index">
      <!-- Space Between Pages -->
      <div v-if="index > 0" :style="{ height: '12px' }"></div>
      <!-- Page background -->
      <div class="page graph-paper"></div>
    </div>

    <a-dropdown :trigger="contextmenutrigger" v-model="contextmenu">
      <!-- equationarea: where all the interaction and computation happens. Should fill up the entire easle area using -->
      <!-- $parent.$el.offsetHeight & $parent.$el.offsetWidth -->
      <div
        v-if="mounted"
        class="equationarea"
        ref="contextarea"
        :style="{ width: $parent.$el.offsetWidth + 'px', height: $parent.$el.offsetHeight + 'px' }"
      >
        <Equation
          v-for="node in storage.equations"
          ref="node"
          class="node_parent"
          :key="node.id"
          :formula="node.function"
          :isselected="storage.activeEquations.includes(node.id) ? true : false"
          :x="node.x"
          :y="node.y"
          :id="node.id"
          :result="node.result"
          :format="mathOptions.outputFormat"
          v-on:selected="id => selectNode(id)"
          v-on:changed="changeinfo => changeNodeValue(changeinfo)"
          v-on:moved="changeinfo => changeNodePosition(changeinfo)"
          v-on:delete="id => deleteNode(id)"
          @mouseover="mouseovernode()"
          @mouseleave="mouseleavenode()"
        />
      </div>

      <a-menu slot="overlay">
        <a-menu-item key="1" @click="addnode">
          Add Equation
        </a-menu-item>
        <a-menu-item key="2" disabled>
          Add Text Box
        </a-menu-item>
        <a-menu-item key="3" @click="() => (this.storage.pages += 1)">
          Add Page
        </a-menu-item>
        <a-menu-item key="4" @click="() => (this.storage.pages -= 1)">
          Delete Page
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import Equation from './EqNode'
import { EventBus } from './eventbus.js'
import interact from 'interactjs'

// import * as Selection from "@simonwep/selection-js";
// import Selection from "https://cdn.jsdelivr.net/npm/@simonwep/selection-js/lib/selection.min.mjs"

const calc = require('../calc/calculator.js')

export default {
  name: 'Page',
  components: {
    Equation
  },
  props: {
    file: Object
  },
  data() {
    return {
      mounted: false,
      scrollPosition: null,
      contextmenu: false,
      contextmenutrigger: [''],
      defaultEquation: { id: 0, x: 0, y: 0, function: '', result: '' },
      mouseX: 0,
      mouseY: 0,
      mathOptions: {
        numberformat: 'decimals',
        decimals: 5,
        outputFormat: 'LaTeX'
      },
      storage: {
        pages: 2,
        activeEquations: [0], // by IDs
        equations: []
      }
    }
  },
  created: function() {
    // copy contencts of prop into local variable for editing
    this.storage = JSON.parse(JSON.stringify(this.file))
    console.log('recreated file - storage, file', this.storage, this.file)
  },
  beforeMount: function() {},
  mounted: function() {
    console.log('remounted file')
    EventBus.$on('doc-math-options', mathOptions => (this.mathOptions = mathOptions))
    EventBus.$on('compute', () => this.compute())
    EventBus.$on('togglevirtualkb', () =>
      this.$refs.node[this.storage.equations.findIndex(element => element.id == this.storage.activeEquations[0])].togglevirtualkb()
    )

    EventBus.$on('togglescratch', () => {
      this.removeInteraction()
      this.addInteraction()
    })
    EventBus.$on('addpage', () => {
      console.log('new page')
      this.storage.pages += 1
    })
    EventBus.$on('newfilerefresh', () => {
      console.log(this.file, this.storage)
      this.storage = this.file
    })

    this.mounted = true

    this.$nextTick(function() {
      this.addInteraction()
    })
  },
  beforeDestroy() {
    // fix to $refs break on hot reload
    interact('.equationarea').unset()
    interact('.node_parent').unset()
    this.mounted = false
  },
  methods: {
    addInteraction() {
      // here's an explanation of how I got the context menu to work
      // this interact.js instance is listening for clicks on the equation area (not child elements)
      // WHEN it detects a 'tap' & right click & and directly on 'equationarea': it quickly enables
      // the context menu trigger (contextmenutrigger) and thus lets antd open the context menu
      // ELSE: it handles other conditions
      // NOTE: the node context menu is always listening to the .node class 'tap's (inside the *node.vue el)

      window.addEventListener('scroll', this.updateScroll)
      // var movable = document.querySelectorAll('.node_parent') //.node_parent  #grid-snap
      interact('.equationarea')
        .pointerEvents({
          // ignoreFrom: '.mathfield',
          ignoreFrom: '.node_parent'
        })
        .on(
          'tap',
          function(event) {
            console.log('tapped', event)
            if (event.button == 0) {
              // left click
              this.storage.activeEquations = []
              this.contextmenu = false
              this.contextmenutrigger = ['']
            } else if (event.button == 2) {
              // right click
              if (event.target.className.includes('equationarea')) {
                this.contextmenutrigger = ['contextmenu']
                this.mouseX = event.x - this.$refs['contextarea'].offsetLeft
                this.mouseY = event.y - this.$refs['contextarea'].offsetTop + this.scrollPosition
              } else {
                this.contextmenutrigger = ['']
              }
            }

            // parent. note : Since the refs is updated on hot-reload but this component is not re-mounted, the refs is lost
            // console.log("Mouse button:", event.pointerId, event.button, event.x) // clientX
            console.log(event.button, 'deselect, scroll:', this.scrollPosition, event.target) // this.$refs['contextarea'].scrollTop
            // event.preventDefault()
          }.bind(this)
        )
    },
    removeInteraction() {
      interact('.equationarea').unset()
      interact('.node_parent').unset()
    },
    updateScroll() {
      this.scrollPosition = window.scrollY
    },
    selectNode(id) {
      console.log('Selecting', id)
      this.storage.activeEquations = [id]
    },
    changeNodeValue(changeInfo) {
      // Finds index of element with that id
      var index = this.storage.equations.findIndex(element => element.id == changeInfo.id)
      if (index >= 0) {
        this.storage.equations[index].function = changeInfo.to
      }
    },
    changeNodePosition(changeInfo) {
      // Finds index of element with that id
      var index = this.storage.equations.findIndex(element => element.id == changeInfo.id)
      if (index >= 0) {
        this.storage.equations[index].x = changeInfo.x
        this.storage.equations[index].y = changeInfo.y
      }
    },
    addnode() {
      // get next available ID
      var next = 1
      var inc = 1
      while (this.storage.equations.findIndex(element => element.id == (next += inc)) > -1);
      console.log('next id', next)
      var newEquation = JSON.parse(JSON.stringify(this.defaultEquation))
      newEquation.id = next
      newEquation.x = this.mouseX - 30 // pageX
      newEquation.y = this.mouseY - 50
      this.storage.equations.push(newEquation)
      this.contextmenu = false
      this.storage.activeEquations = [next]
      // some hackery to make sure the new component renderd before calling it
      setTimeout(() => {
        // setTimeout to put this into event queue
        // executed after render
        EventBus.$emit('focus', next)
      }, 0)
      console.log(this.storage.activeEquations)
    },
    deleteNode(id) {
      var index = this.storage.equations.findIndex(element => element.id == id)
      if (index > -1) {
        this.storage.equations.splice(index, 1)
      }
    },
    handleChangeNformat(value) {
      this.mathOptions.numberformat = value
    },
    handleChangeOUTformat(value) {
      this.mathOptions.outputFormat = value
      this.compute()
    },
    mouseovernode() {
      console.log('mouseover')
      this.contextmenutrigger = ['']
    },
    mouseleavenode() {
      console.log('mouseleave')
      this.contextmenutrigger = ['contextmenu']
    },
    getFile() {
      return this.storage
    },
    compute() {
      calc.flush()
      // sort the equations by y position, if equal, x position
      this.storage.equations.sort((a, b) => (a.y > b.y ? 1 : a.y === b.y ? (a.x > b.x ? 1 : -1) : -1))
      this.storage.equations.forEach((equation, index, equations) => {
        // find the vue element with the same ID as the looped equation
        var nodeelement = this.$refs['node'].find(el => el.id === equation.id)
        // call the getValue function
        var ascii = JSON.parse(JSON.stringify(nodeelement.getValue('ascii-math')))
        console.log(ascii, equation.function, nodeelement)

        equations[index].result = ''
        // var val = calc.calculate(ascii) // equation.function
        var val = calc.calculate(equation.function, this.mathOptions)
        console.log('Result:', val)
        if (val.text == 'error' || val.error) {
          this.$notification['error']({
            message: val.error,
            description: val.body
          })
        }
        if (this.mathOptions.outputFormat == 'string') {
          equations[index].result = val.text
        } else {
          equations[index].result = val.LaTeX
        }
      })
    }
  },
  computed: {}
}
</script>

<style scoped>
.graph-paper {
  --back-color: #fffdf8;
  --front-color: #bed1d354;
  /* width: 100%;
  height: 100%; */
  background-color: var(--back-color);
  /* opacity: .4; */
  background-image: linear-gradient(var(--front-color) 2px, transparent 2px), linear-gradient(90deg, var(--front-color) 1px, transparent 2px),
    linear-gradient(var(--front-color) 0px, transparent 1px), linear-gradient(90deg, var(--front-color) 1px, var(--back-color) 1px);
  background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
  background-position: -4px -3px, -3px -4px, -2px -3px, -3px -2px;
}
.equationarea {
  position: absolute;
  padding: 24px;
  top: calc(24px + 36px);
}
.node_parent {
  position: absolute;
  width: auto;
  height: auto;
  padding: 2px;
}
</style>
