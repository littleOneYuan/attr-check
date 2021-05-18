<template>
  <div class="a-check">
    <Row>
      <Col flex="110px">
        <span class="c-fix-title wt">{{ attr_name }}</span>
      </Col>
      <!-- 时间 -->
      <Col flex="auto">
        <date-pick
          type="daterange"
          :value="datetime"
          :options="datetimeOption"
          confirm
          :clearable="false"
          :editable="false"
          split-panels
          :transfer="false"
          @on-change="handleDatetime"
          @on-ok="confirmDatetime"
          @on-clear="day_clear"
          @on-clear-shortcut="clearShortCut"
          placement="bottom-start"
          placeholder="请选择查询日期范围"
          style="width: 200px"
        />
      </Col>
    </Row>
    <Divider />
  </div>
</template>
<script>
import shortcuts from '@/data/shortcuts'
import DatePick from '@/components/date-picker'
import { deepCopy } from '@/common/js/c_common'
// import { formatDate } from '@/common/js/utils'
export default {
  name: 'a-check',
  components: {
    DatePick
  },
  data () {
    // const date = new Date()
    // var fday
    // if (date.getMonth() < 9) {
    //   fday = date.getFullYear() + '-0' + (date.getMonth() + 1) + '-01'
    // } else {
    //   fday = date.getFullYear() + '-' + (date.getMonth() + 1) + '-01'
    // }
    // const now = formatDate(date, 'yyyy-MM-dd') // 初始化默认时间
    return {
      datetime: deepCopy(this.initDate),
      // datetime: [fday, now],
      comDate: deepCopy(this.initDate),
      // comDate: [fday, now],
      datetimeOption: {
        shortcuts,
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      }
    }
  },
  props: {
    attr_name: {
      type: String,
      default () {
        return '属性名'
      }
    },
    initDate: {
      type: Array,
      default () {
        return ['', '']
      }
    }
  },
  computed: {},
  methods: {
    // 日期选择器
    handleDatetime (val) {
      this.datetime = val
    },
    confirmDatetime () {
      this.comDate = JSON.parse(JSON.stringify(this.datetime))
      this.$emit('getData', this.comDate, this.attr_name)
    },
    day_clear () {
      // const date = new Date()
      // var fday
      // if (date.getMonth() < 9) {
      //   fday = date.getFullYear() + '-0' + (date.getMonth() + 1) + '-01'
      // } else {
      //   fday = date.getFullYear() + '-' + (date.getMonth() + 1) + '-01'
      // }
      // const now = formatDate(date, 'yyyy-MM-dd') // 初始化默认时间
      // this.datetime = [fday, now]
      this.datetime = ['', '']
      this.comDate = JSON.parse(JSON.stringify(this.datetime))
      this.$emit('getData', this.comDate, this.attr_name)
    },
    clearShortCut () {
      const shortCut = document.querySelectorAll('.ivu-picker-panel-shortcut')
      const len = shortCut.length
      for (let i = 0; i < len; i++) {
        shortCut[i].style.background = 'none'
      }
    }
  },
  watch: {},
  created () {
    setTimeout(() => {
      this.datetime = deepCopy(this.initDate)
      this.comDate = deepCopy(this.initDate)
      this.confirmDatetime()
    }, 1000)
  }
}
</script>
<style lang="stylus" scoped>
// /deep/.ivu-picker-confirm>.ivu-btn:first-child {
//   display: none;
// }
</style>
