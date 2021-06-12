<template>
  <div id="grid-snap" ref="myid">
    <a-dropdown v-model="contextmenu" :trigger="['contextmenu']">
      <div class="node" :class="[isselected ? 'selected' : 'notselected']">
        <!-- put a 4px space between node, =, result -->
        <a-space :size="4">
          <mathlive-mathfield
            :id="'mf_' + id"
            ref="mathfield"
            class="mathfield"
            :options="{
              smartFence: false,
              virtualKeyboardMode: 'none',
              virtualKeyboards: 'all',
              virtualKeyboardTheme: 'apple',
              fontsDirectory: './fonts'
            }"
            @focus="ping"
            @input="change"
            v-model="localformula"
          >
            {{ formula }}
          </mathlive-mathfield>
          <div v-if="format == 'string' && result">
            {{ result | ifdisplayableresult }}
          </div>
          <div v-else-if="format == 'LaTeX' && result">
            <katex-element expression="=" style="display: inline-block" />
            <div v-katex="result" style="display: inline-block" />
          </div>

          <p v-if="result">
            &nbsp;
          </p>
        </a-space>
      </div>

      <a-menu slot="overlay">
        <a-menu-item
          @click="
            () => {
              contextmenu = false
              copyToClipboard(formula)
            }
          "
        >
          Copy Equation
        </a-menu-item>
        <a-menu-item
          @click="
            () => {
              contextmenu = false
              copyToClipboard(result)
            }
          "
        >
          Copy Result
        </a-menu-item>
        <a-menu-item
          @click="
            () => {
              contextmenu = false
              getClipboard(text => change(text))
              return true
            }
          "
        >
          Paste Equation
        </a-menu-item>
        <a-menu-item @click="deletenode">
          Delete
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import interact from 'interactjs'

// import { EventBus } from './eventbus.js'

export default {
  name: 'Node',
  components: {},
  props: {
    id: Number,
    formula: String,
    result: String,
    isselected: Boolean,
    x: Number,
    y: Number,
    format: String
  },
  data() {
    return {
      gridSize: 20, // px
      localformula: '',
      contextmenu: false,
      shadowRootEl: null
    }
  },
  mounted: function() {
    this.initformula = this.formula
    this.$on('focus', id => {
      if (id == this.id) this.makeFocus()
    })
    this.makeInteractable(this.$refs.myid)
    this.$nextTick(() => {
      this.mathfieldStyleing()
    })
  },
  updated() {
    this.$nextTick(function() {
      // Code that will run only after the
      // entire view has been re-rendered
      this.mathfieldStyleing()
    })
  },
  methods: {
    mathfieldStyleing() {
      // console.log('doing', this.$refs.mathfield, this.$el, this.$el.querySelector('#mf' + this.id)) //document.querySelectorAll('.mathfield')
      // document
      //   .querySelector('.mathfield')
      //   .shadowRoot.querySelector('.ML__fieldcontainer')
      //   .setAttribute('style', 'min-height: 1px;')
      // document
      //   .querySelector('#mf')
      //   .shadowRoot.querySelector('div > span.ML__fieldcontainer')
      //   .setAttribute('style', 'min-height: 1px;')
      // this.$refs.mathfield.$el.shadowRoot.querySelector('div > .ML__fieldcontainer').style['minHeight'] = '1px'
      // this.$refs.mathfield.$el.shadowRoot.querySelector('div > span.ML__fieldcontainer > span').style['padding'] = '0px'
      // this.$el.querySelector('#mf').shadowRoot.querySelector('div > .ML__fieldcontainer').style['minHeight'] = '1px'
      // this.$el.querySelector('#mf').shadowRoot.querySelector('div > span.ML__fieldcontainer > span').style['padding'] = '0px'
      this.shadowRootEl = document.querySelector('#mf_' + this.id).shadowRoot
      // var shadowRootElstyle = this.shadowRootEl.querySelector('style') // where the black border is at...
      this.shadowRootEl.querySelector('div > .ML__fieldcontainer').style['minHeight'] = '1px'
      // document.querySelector('#mf_' + this.id).shadowRoot.querySelector('div > .ML__fieldcontainer').style['minWidth'] = '10px'
      this.shadowRootEl.querySelector('div > .ML__fieldcontainer > span').style['padding'] = '0px'
    },
    makeInteractable(element) {
      // https://interactjs.io/
      var x = this.x
      var y = this.y
      var id = this.id
      element.style.transform = 'translate(' + this.x + 'px, ' + this.y + 'px)'
      // var parent = this // alternative to .bind(this)

      interact(element)
        .draggable({
          allowFrom: '.node',
          ignoreFrom: '.ML__fieldcontainer', // .ML__mathlive
          modifiers: [
            interact.modifiers.snap({
              targets: [interact.snappers.grid({ x: this.gridSize, y: this.gridSize })],
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
        .on(
          'tap',
          function() {
            // EventBus.$emit('selected', id)
            this.$emit('selected', id)
            console.log('Mouse button:', event.button, event.x)
            // parent.contextmenu = false
            // if (event.button == 2) {
            //   parent.contextmenu = true
            // }
          }.bind(this)
        )
        .on('doubletap', function(event) {
          event.preventDefault()
        })
        .on(
          'dragmove',
          function(event) {
            x += event.dx
            y += event.dy
            // EventBus.$emit('selected', id)
            // EventBus.$emit('moved', { id: id, x: x, y: y })
            this.$emit('selected', id)
            this.$emit('moved', { id: id, x: x, y: y })
            event.target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
          }.bind(this)
        )
    },
    makeFocus() {
      console.log('Focusing on', this.$refs.mathfield)
      this.$emit('selected', this.id)
    },
    ping: function() {
      console.log('ping', this.id, 'ascii:', this.$refs.mathfield.getValue('ascii-math'))
      this.makeFocus()
      // used settimeout bc keyboard overlay transition would intercept context menu
      // setTimeout(() => {
      //   this.$refs.mathfield.executeCommand(['showVirtualKeyboard'])
      // }, 200)
    },
    change: function(event) {
      console.log('changed to', event, typeof event)
      this.$emit('changed', { id: this.id, to: event })
      // this.$emit('init') // refresh
      this.localformula = event
    },
    deletenode: function() {
      this.$emit('delete', this.id)
    },
    getValue(type) {
      console.log('getting')
      return this.$refs.mathfield.getValue(type)
    },
    copyToClipboard(text) {
      var dummy = document.createElement('textarea')
      // to avoid breaking orgain page when copying more words
      // cant copy when adding below this code
      // dummy.style.display = 'none'
      document.body.appendChild(dummy)
      //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
      dummy.value = text
      dummy.select()
      document.execCommand('copy')
      document.body.removeChild(dummy)
    },
    getClipboard(cb) {
      navigator.clipboard.readText().then(text => cb(text))
    }
  },
  filters: {
    ifdisplayableresult: function(value) {
      if (!value) return ''
      return '=' + value + ' '
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
  /* position: absolute; */
  /* put equal sign to the right of the node */
  white-space: nowrap;
  /* border: 1px solid #ddd; */
  /* border-radius: 5px; */
  /* background-color: #fff; */
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
  /* margin: 10px 0 10px 0; */
  border-radius: 5px;
  background-color: #fff;
  /* display: inline-block; */
  font-size: 16px;
  padding: 5px;
  /* margin: 5px; */
}
.output {
  padding: 5px;
  margin: 20px 0 20px 0;
  border-radius: 5px;
  border: 1px solid #000;

  font-family: 'Source Code Pro', Menlo, 'Bitstream Vera Sans Mono', Monaco, Courier, 'Andale Mono', monospace;
  color: #f0c674;
  background: #35434e;
}
</style>

<style>
/* @import "../node_modules/katex/dist/katex.min.css"; */
/* These used to work at mathlive 0.68.1 ? */
/* .ML__fieldcontainer {
  height: 19px !important;
  min-width: 20px;
} */
/* .ML__fieldcontainer_field {
  min-width: 40px;
} */
.ML__keyboard {
  transition: none !important;
}
.ML__keyboard--plate {
  transition: none !important;
}
body.ML__fonts-loading .ML__base {
  visibility: visible !important;
}
/* math-field::part(virtual-keyboard-toggle) {
  color: red;
} */
/* ::math-field(div > .ML__fieldcontainer) {
  min-width: 200px;
} */
</style>
