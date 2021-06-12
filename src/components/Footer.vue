<template>
  <div class="footer">
    <a-row type="flex" justify="space-between">
      <a-col :span="4">
        <a-space :style="{ height: '36px' }">
          <div :style="{ width: '20px' }" />
          <!-- <a-icon type="calculator" /> -->
          <a-tooltip :mouseEnterDelay="1">
            <template slot="title">
              Calculate
            </template>
            <a-button size="small" type="primary" @click="compute"><a-icon type="calculator"/></a-button>
          </a-tooltip>
          <!-- Auto Calculate -->
          <a-tooltip>
            <template slot="title">
              Auto Calculate
            </template>
            <a-switch size="small" disabled />
          </a-tooltip>
        </a-space>
      </a-col>

      <a-col>
        <a-space :style="{ height: '36px' }">
          <a-tooltip>
            <template slot="title">
              Popout Keyboard
            </template>
            <a-button size="small" @click="togglevirtualkb"><a-icon type="appstore"/></a-button>
          </a-tooltip>

          <div :style="{ width: '20px' }" />

          <!-- Number Format -->
          <a-select
            default-value="Decimal"
            style="width: 100px"
            size="small"
            @change="handleChangeNformat"
            :getPopupContainer="trigger => trigger.parentNode"
          >
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
          <a-input-number
            v-if="mathOptions.numberformat == 'decimals'"
            id="inputNumber"
            style="width: 60px"
            size="small"
            @change="handleChangeDecimalPlaces"
            :min="1"
            :max="10"
            :default-value="mathOptions.decimals"
          />
          <a-select
            default-value="LaTeX"
            style="width: 100px"
            size="small"
            @change="handleChangeOUTformat"
            :getPopupContainer="trigger => trigger.parentNode"
          >
            <a-select-option value="string">
              String
            </a-select-option>
            <a-select-option value="LaTeX">
              LaTeX
            </a-select-option>
          </a-select>

          <div :style="{ width: '20px' }" />

          <!-- ScratchPad -->
          <a-tooltip>
            <template slot="title">
              Scratch Pad
            </template>
            <a-space>
              <a-icon type="export" class="vert-icon" />
              <a-switch size="small" @change="handleChangeScratchPad" />
            </a-space>
          </a-tooltip>

          <!-- <div :style="{ width: '20px' }" /> -->

          <!-- Zoom -->
          <!-- <a-icon type="zoom-out" class="vert-icon" />
          <a-slider
            id="test"
            :min="50"
            :max="150"
            :step="25"
            :default-value="100"
            :style="{ width: '100px', marginTop: '6px', marginBottom: '6px' }"
            disabled
          />
          <a-icon type="zoom-in" class="vert-icon" /> -->

          <div :style="{ width: '20px' }" />
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { EventBus } from './eventbus.js'

export default {
  name: 'Page',
  components: {},
  props: {},
  data() {
    return {
      scrollPosition: null,
      outputFormat: 'LaTeX',
      mathOptions: {
        numberformat: 'decimals',
        decimals: 5,
        outputFormat: 'LaTeX'
      }
    }
  },
  mounted: function() {},
  beforeDestroy() {},
  methods: {
    handleChangeNformat(value) {
      this.mathOptions.numberformat = value
      this.updateDocOptions()
    },
    handleChangeOUTformat(value) {
      this.mathOptions.outputFormat = value
      this.updateDocOptions()
      this.compute()
    },
    handleChangeDecimalPlaces(value) {
      this.mathOptions.decimals = value
      this.updateDocOptions()
    },
    handleChangeScratchPad(value) {
      console.log(value)
      EventBus.$emit('togglescratch', value)
    },
    updateDocOptions() {
      EventBus.$emit('doc-math-options', this.mathOptions)
    },
    togglevirtualkb() {
      EventBus.$emit('togglevirtualkb')
    },
    compute() {
      EventBus.$emit('compute')
    }
  },
  computed: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer {
  background: white;
  position: fixed;
  bottom: 0;
  /* z-index: 1; */
  width: 100%;
  height: 36px;
  box-shadow: 0px 0px 5px 0.1px #ccc;
}
.ant-space-item {
  height: 24px !important;
}
.ant-select-dropdown-placement-bottomLeft {
  all: initial !important;
}
.vert-icon {
  vertical-align: -0.225em !important;
}
</style>
