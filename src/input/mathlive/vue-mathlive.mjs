/* MathLive 0.69.2  */
var t = {
  name: 'mathlive-mathfield',
  template: '<math-field :id="id"><slot></slot></math-field>',
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
      t !== this.$el.getValue() && this.$el.setValue(t, { suppressChangeNotifications: !0 })
    },
    options: {
      deep: !0,
      handler(t, e) {
        JSON.stringify(t) !== JSON.stringify(e) && this.$el.setOptions(t)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$el.setOptions({
        ...this.options,
        onContentDidChange: t => {
          this.$emit('input', this.$el.getValue())
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
      this.$el.executeCommand(t)
    },
    hasFocus() {
      return this.$el.hasFocus()
    },
    focus() {
      this.$el.focus()
    },
    blur() {
      this.$el.blur()
    },
    getValue(t) {
      return this.$el.getValue(t)
    },
    insert(t, e) {
      this.$el.insert(t, e)
    },
    select() {
      this.$el.select()
    }
  }
}
export default t
