<template>
  <div class="ai-compare">
    <Row>
      <Col flex="110px">
        <span class="c-fix-title wt">{{ attr_name }}</span>
      </Col>
      <Col flex="90px" v-if="nolimit">
        <Button v-if="checked" type="primary" @click="noLimit">不限</Button>
        <Button v-else @click="noLimit">不限</Button>
      </Col>
      <!-- 单层选择器 -->
      <Col flex="auto" v-if="!checked">
        <ciCompare
          :init_judge="init_judge"
          v-model="judgeNum"
          :initNum="init_num"
          @getData="getJudge"
        />
        <span v-show="tip_show" class="tip-span">{{ Msg }}</span>
      </Col>
    </Row>
    <Divider />
  </div>
</template>
<script>
import ciCompare from '@/components/ci-compare'
import { deepCopy } from '@/common/js/c_common'
export default {
  name: 'ai-compare',
  components: {
    ciCompare
  },
  data () {
    return {
      checked: true,
      init_num: deepCopy(this.initData.judgeRange),
      init_judge: this.initData.judge,
      judgeNum: this.initData.judgeNum,
      Msg: '',
      tip_show: false
    }
  },
  props: {
    nolimit: {
      type: Boolean,
      default () {
        return true
      }
    },
    attr_name: {
      type: String,
      default () {
        return '属性名'
      }
    },
    initData: {
      type: Object,
      default () {
        return {
          judge: 0,
          judgeNum: 0,
          judgeRange: {
            min: null,
            max: null
          }
        }
      }
    }
  },
  computed: {},
  methods: {
    // 限制还是不限
    noLimit () {
      this.checked = !this.checked
      if (this.checked) {
        // 选中不限
        this.checked_attr = []
        this.$emit('getData', '不限', this.attr_name)
        this.init_judge = null
        this.judgeNum = null
      } else {
        if (this.tip_show) this.tip_show = false
        var resObj = {}
        this.$Message.info('这里有默认值哦~可以自行修改哦o(*￣▽￣*)ブ')
        this.init_judge = 1
        this.judgeNum = 1
        resObj.content = '>1'
        resObj.val = {
          judge: 1,
          judgeNum: 1,
          nolimit: false
        }
        this.$emit('getData', resObj, this.attr_name)
      }
    },
    getJudge (label, judge, numRange, content) {
      this.checked = false
      var resObj = {}
      if (this.judgeNum === Infinity || this.judgeNum === 1e30) {
        this.Msg = 'Tips：您输入的数值过大o(╥﹏╥)o请重新输入哦~~'
        this.tip_show = true
      } else {
        if (this.tip_show) this.tip_show = false
      }
      if (judge === 7) {
        // range
        resObj.content = content
        resObj.val = {
          judge: 7,
          label: label,
          judgeRange: numRange,
          nolimit: false
        }
      } else {
        // num
        resObj.content =
          this.judgeNum !== null && this.judgeNum !== Infinity && this.judgeNum !== 1e30
            ? label + this.judgeNum
            : ''
        resObj.val = {
          judge: judge,
          label: label,
          judgeNum: this.judgeNum,
          nolimit: false
        }
      }
      this.$emit('getData', resObj, this.attr_name)
    }
  },
  watch: {},
  created () {
    if (this.initData.judge !== 0) {
      this.checked = false
    }
    setTimeout(() => {
      if (this.initData.judge !== 0) {
        this.checked = false
      }
      this.init_num = deepCopy(this.initData.judgeRange)
      this.init_judge = this.initData.judge
      this.judgeNum = this.initData.judgeNum
    }, 500)
  }
}
</script>
<style lang="stylus" scoped>
.tip-span {
  margin-left: 10px
}
</style>
