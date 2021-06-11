/* MathLive 0.68.1  */
var t = {
  name: 'mathlive-mathfield',
  template: '<div class="mathfield" :id="id"><slot></slot></div>',
  props: {
    id: { type: String, default: '' },
    value: { type: String, default: '' },
    options: { type: Object, default: () => ({}) },
    onKeystroke: { type: Function, default: (t, e) => !0 },
    onMoveOutOf: { type: Function, default: t => !0 },
    onTabOutOf: { type: Function, default: t => !0 }
  },
  install(t, e) {
    Object.defineProperty(t.prototype, '$mathlive', { value: e }), t.component('mathlive-mathfield', this)
  },
  watch: {
    value(t, e) {
      t !== this.$el.mathfield.getValue() && this.$el.mathfield.setValue(t, { suppressChangeNotifications: !0 })
    },
    options: {
      deep: !0,
      handler(t, e) {
        JSON.stringify(t) !== JSON.stringify(e) && this.$el.mathfield.setOptions(t)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$mathlive.makeMathField(this.$el, {
        ...this.options,
        onContentDidChange: t => {
          this.$emit('input', this.$el.mathfield.getValue())
        },
        onFocus: t => {
          this.$emit('focus')
        },
        onBlur: t => {
          this.$emit('blur')
        },
        onUndoStateDidChange: (t, e) => {
          this.$emit('undo-state-did-change', e)
        },
        onReadAloudStatus: (t, e) => {
          this.$emit('read-aloud-status-change', e)
        },
        onKeystroke: (t, e, i) => this.onKeystroke(e, i),
        onMoveOutOf: (t, e) => this.onMoveOutOf(e),
        onTabOutOf: (t, e) => this.onTabOutOf(e)
      })
    })
  },
  methods: {
    executeCommand(t) {
      this.$el.mathfield.executeCommand(t)
    },
    hasFocus() {
      return this.$el.mathfield.hasFocus()
    },
    focus() {
      this.$el.mathfield.focus()
    },
    blur() {
      this.$el.mathfield.blur()
    },
    getValue(t) {
      return this.$el.mathfield.getValue(t)
    },
    selectedText(t) {
      return this.$el.mathfield.$selectedText(t)
    },
    insert(t, e) {
      this.$el.mathfield.insert(t, e)
    },
    select() {
      this.$el.mathfield.select()
    }
  }
}
export default t
