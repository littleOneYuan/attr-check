<template>
  <div class="c-ntn">
    <InputNumber
      :min="0"
      :max="1000000000"
      :precision="2"
      v-model="numData.min"
      @on-change="numJudge(numData.min, numData.max)"
      @on-blur="numJudge(numData.min, numData.max)"
    ></InputNumber>
    <span>-</span>
    <InputNumber
      :min="0"
      :max="1000000000"
      :precision="2"
      v-model="numData.max"
      @on-change="numJudge(numData.min, numData.max)"
      @on-blur="numJudge(numData.min, numData.max)"
    ></InputNumber>
  </div>
</template>

<script>
import { c_init_range_handle } from '@/common/js/c_common'
export default {
  name: 'c-ntn',
  components: {},
  data () {
    return {
      numData: {
        min: null,
        max: null
      }
    }
  },
  props: {
    numSpan: {
      type: String,
      default () {
        return ''
      }
    },
    initNum: {
      type: Object,
      default () {
        return {
          min: null,
          max: null
        }
      }
    }
  },
  methods: {
    numJudge (min, max) {
      if (
        (min > -1 && max > -1 && (min < max || min === max)) ||
        min === null ||
        max === null
      ) {
        this.$emit('func', [min, max])
      } else {
        this.$Message.warning(`${this.numSpan}请输入正确的范围~>.<~`)
        setTimeout(() => {
          this.numData.min = null
          this.numData.max = null
          this.$emit('func', [null, null])
        })
      }
    }
  },
  created () {
    setTimeout(() => {
      if (typeof this.initNum.min !== 'object' || typeof this.initNum.min !== 'object') {
        // 需要赋初值时才执行
        var numData_temp = c_init_range_handle(this.initNum)
        if (typeof numData_temp.min === 'object') numData_temp.min = null
        if (typeof numData_temp.max === 'object') numData_temp.max = null
        this.numData = numData_temp
        this.numJudge(this.numData.min, this.numData.max)
      }
    }, 2000)
  }
}
</script>

<style lang="stylus" scoped>
.c-ntn {
  display inline-block
}
.ivu-input-number {
  width 100px
}
</style>
