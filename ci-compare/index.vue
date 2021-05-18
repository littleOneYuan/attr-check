<template>
  <div class="ci-compare">
    <Select
      v-model="judge"
      placeholder="比较"
      style="width: 80px"
      @on-open-change="judge_change"
    >
      <Option v-for="item in judgeList" :value="item.value" :key="item.value">{{
        item.label
      }}</Option>
    </Select>
    <InputNumber
      v-if="judge !== 7"
      v-model="judgeNum"
      :value="judgeNum"
      :min="0"
      @on-blur="getNum"
    ></InputNumber>
    <!-- <nToN v-if="judge === 7" @func="setData" :initNum="init_num" :num-flag="1"></nToN> -->
    <ci-ntn v-if="judge === 7" @func="setData" :initNum="init_num"></ci-ntn>
  </div>
</template>
<script>
import attrBox from '@/data/user/attr_box'
import ciNtn from '@/components/ci-ntn'
// import nToN from '@/components/numtonum/nToN'
import {
  cntnData_handle,
  c_init_range_handle,
  c_commit_range_handle
} from '@/common/js/c_common'
export default {
  name: 'ci-compare',
  components: {
    ciNtn
  },
  props: {
    init_judge: {
      type: Number,
      default () {
        return 0
      }
    },
    value: {
      type: Number
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
  computed: {
    judgeNum: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
        if (!this.judge) {
          this.judge = 1
          this.judgelabel = '>'
        }
        if (this.judge !== 7) {
          this.$emit('getData', this.judgelabel, this.judge, this.judgeNum, null)
        } else {
          this.$emit(
            'getData',
            this.judgelabel,
            this.judge,
            this.judgeRange,
            this.judgeContent
          )
        }
      }
    }
  },
  data () {
    return {
      attrBox: attrBox,
      init_num: this.initNum,
      judge: this.init_judge,
      judgelabel: '',
      judgeContent: '',
      judgeRange: {
        min: '',
        max: ''
      },
      judgeList: attrBox.judgeList
    }
  },
  watch: {
    init_judge (n, o) {
      this.judge = n
    }
  },
  methods: {
    setData (data) {
      this.judgeContent = cntnData_handle(data).content
      this.judgeRange = cntnData_handle(data).range
      this.$emit(
        'getData',
        this.judgelabel,
        this.judge,
        this.judgeRange,
        this.judgeContent
      )
    },
    getNum () {
      if (typeof this.judgeNum === 'number') {
        // this.$emit('getData', this.judgelabel, this.judge, this.judgeNum, null)
      } else {
        this.$Message.info('这里有默认值哦~可以自行修改哦o(*￣▽￣*)ブ')
        this.judgeNum = 1
        // this.$emit('getData', this.judgelabel, this.judge, this.judgeNum, null)
      }
    },
    judge_change (open) {
      if (!open) {
        if (typeof this.judge === 'number') {
          if (this.judge !== 0) {
            this.judgelabel = this.judgeList.find(
              (item) => item.value === this.judge
            ).label
          }
          if (this.judge !== 7) {
            if (this.judgeNum === null) this.judgeNum = 1
            this.$emit('getData', this.judgelabel, this.judge, this.judgeNum, null)
          } else {
            const range = c_commit_range_handle(this.judgeRange)
            this.$emit('getData', this.judgelabel, this.judge, range, this.judgeContent)
          }
        }
      }
    }
  },
  created () {
    setTimeout(() => {
      this.init_num = c_init_range_handle(this.initNum)
      this.judge = this.init_judge
      this.judge_change()
    }, 2100)
  }
}
</script>

<style lang="stylus" scoped>
.ci-compare {
  display: inline-block
}
.ivu-select {
  margin-right: 10px
}
</style>
