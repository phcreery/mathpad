<template>
  <div id="grid-snap" ref="myid">
    <a-dropdown v-model="contextmenu" :trigger="['click']">
      <!-- <a-tooltip placement="right">
        <template slot="title">
          [{{id}}]  {{formula}} = {{result}}
          <a-icon type="setting" @click="()=>{}"/>
        </template> -->

      <div
        no-pointer-event
        class="node"
        :class="[isselected ? 'selected' : 'notselected']"
      >
        <mathlive-mathfield
          id="mf"
          ref="mathfield"
          :options="{ smartFence: false, virtualKeyboardMode: 'onfocus' }"
          @focus="ping"
          @input="change"
        >
          <!-- v-model="initformula" -->
          {{ formula }}
        </mathlive-mathfield>
        {{ result | ifdisplayableresult }}
      </div>

      <!-- </a-tooltip> -->

      <a-menu slot="overlay">
        <a-menu-item @click="deletenode">
          Delete
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import interact from 'interactjs'

// // import MathLive from "./mathlive/mathlive.min.mjs";
// import MathfieldComponent  from "../mathlive/vue-mathlive.vue";

import { EventBus } from './eventbus.js'

export default {
  name: 'Node',
  components: {
    // MathliveMathfield,
    // mathlivemathfield : MathfieldComponent
  },
  props: {
    id: Number,
    formula: String,
    result: String,
    isselected: Boolean,
    x: Number,
    y: Number
  },
  data() {
    return {
      gridSize: 20, // px
      initformula: '',
      contextmenu: false
    }
  },
  mounted: function() {
    this.initformula = this.formula
    // EventBus.$on('focus', (id) => { id == this.id ? this.$refs.mathfield.focus() : undefined }) // this.$refs.mathfield.focus()
    // console.log('ready')
    this.makeInteractable(this.$refs.myid)
  },
  methods: {
    makeInteractable(element) {
      // https://interactjs.io/
      var x = this.x
      var y = this.y
      var id = this.id
      element.style.transform = 'translate(' + this.x + 'px, ' + this.y + 'px)'
      // var parent = this

      interact(element)
        .draggable({
          allowFrom: '.node',
          ignoreFrom: '.ML__mathlive',
          modifiers: [
            interact.modifiers.snap({
              targets: [
                interact.snappers.grid({ x: this.gridSize, y: this.gridSize })
              ],
              range: Infinity,
              relativePoints: [{ x: 0, y: 0 }]
            }),
            interact.modifiers.restrict({
              restriction: element.parentNode,
              elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
              endOnly: true
            })
          ],
          inertia: true
        })
        // .pointerEvents({
        //   ignoreFrom: '.ML__mathlive', // ".ML__fieldcontainer"  [no-pointer-event]
        // })
        .on('tap', function() {
          EventBus.$emit('selected', id)
        })
        // .on('doubletap', function (event) {
        //   parent.contextmenu = true
        //   event.preventDefault()
        // })
        .on('dragmove', function(event) {
          x += event.dx
          y += event.dy
          EventBus.$emit('selected', id)
          EventBus.$emit('moved', { id: id, x: x, y: y })
          event.target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
        })
    },
    ping: function() {
      console.log('ping', this.$refs.mathfield.getValue('ascii-math'))
      EventBus.$emit('selected', this.id)
    },
    change: function(event) {
      console.log('changed to', event)
      EventBus.$emit('changed', { id: this.id, to: event })
    },
    deletenode: function() {
      EventBus.$emit('delete', this.id)
    },
    getValue(type) {
      console.log('getting')
      return this.$refs.mathfield.getValue(type)
    }
  },
  filters: {
    ifdisplayableresult: function(value) {
      if (!value) return ''
      return '= ' + value + ' '
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#grid-snap {
  /* width: 100%; */
  border-radius: 4px;
  padding: 1px;
  /* margin: 2px; */
  /* margin: 1rem 0 0 1rem; */
  /* background-color: #29e; */
  /* color: #fff; */
  /* font-size: 1.2em; */
  touch-action: none;
  width: fit-content;
}
.node {
  /* relative to top-left of page sor that grid is not affected by surrounding nodes */
  position: absolute;
  /* put equal sign to the right of the node */
  white-space: nowrap;
}
.selected {
  border: 1px;
  border-color: #7bb193;
  border-style: dashed;
  border-radius: 5px;
}
.notselected {
  border: 1px;
  border-color: #b17b7b00;
  border-style: dashed;
  border-radius: 5px;
}
.mathfield {
  border: 1px solid #ddd;
  padding: 5px;
  /* margin: 10px 0 10px 0; */
  border-radius: 5px;
  background-color: #fff;
  display: inline-block;
}
.output {
  padding: 5px;
  margin: 20px 0 20px 0;
  border-radius: 5px;
  border: 1px solid #000;

  font-family: 'Source Code Pro', Menlo, 'Bitstream Vera Sans Mono', Monaco,
    Courier, 'Andale Mono', monospace;
  color: #f0c674;
  background: #35434e;
}
</style>

<style>
.ML__fieldcontainer {
  min-height: 19px !important;
}
</style>
