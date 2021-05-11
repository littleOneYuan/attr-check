<template>
  <div class="a-pay">
    <Row>
      <Col flex="110px">
        <span class="c-fix-title wt">{{ attr_name }}</span>
      </Col>
      <Col flex="90px" v-if="nolimit">
        <Button v-if="checked" type="primary" @click="noLimit">不限</Button>
        <Button v-else @click="noLimit">不限</Button>
      </Col>
      <Col flex="auto">
        <Button
          v-if="!select_show && !checked"
          type="primary"
          ghost
          @click="select_handle"
          >{{ btn_name }}</Button
        >
        <Button v-if="select_show && !checked" type="primary" @click="select_confirm"
          >确认</Button
        >
        <Select
          v-if="!checked"
          v-model="dim"
          placeholder="累计维度"
          style="width: 140px"
          @on-open-change="dim_change"
        >
          <Option v-for="item in dimList" :value="item.value" :key="item.value">{{
            item.label
          }}</Option>
        </Select>
        <cCompare
          v-if="!checked"
          :init_judge="init_judge"
          v-model="judgeNum"
          :initNum="init_num"
          @getData="getJudge"
        />
        <span v-show="tip_show && !checked" class="tip-span">{{ Msg }}</span>
      </Col>
    </Row>
    <div class="select-div" v-if="select_show && !checked">
      <Spin size="large" fix v-if="spinShow"></Spin>
      <selecter
        v-model="mult_group"
        :data="selectList"
        search
        :title="['一级', '二级']"
        @on-select="selectAll"
        @on-delete="delTag"
        @on-clear="clearTag"
      />
    </div>
    <Divider />
  </div>
</template>
<script>
import attrBox from '@/data/user/attr_box'
import cCompare from '@/components/c-compare'
import { gameGroup_handle, set_gameGroup } from '@/common/js/c_common'
import Selecter from '@/components/select/selecter.vue'
import { findCheck, getNameOfData, clearTagOfData, deepCopy } from '@/common/js/utils'
export default {
  name: 'a-pay',
  components: {
    cCompare,
    Selecter
  },
  data () {
    return {
      dim: this.initData.dim,
      dimLabel: '',
      Msg: '',
      tip_show: false,
      spinShow: false,
      checked: false,
      init_judge: this.initData.judge,
      judgeNum: this.initData.judgeNum,
      init_num: deepCopy(this.initData.judgeRange),
      judgeValue: '',
      judgeLabel: '',
      rangeContent: '',
      judgeRange: null,
      select_show: false,
      selectList: [],
      select_init: [],
      selectLabels: [],
      selectKeys: [],
      selectIds: [],
      selectedList: deepCopy(this.initData.selList),
      dimList: deepCopy(attrBox.dimList)
    }
  },
  props: {
    attr_name: {
      type: String,
      default () {
        return '属性名'
      }
    },
    nolimit: {
      type: Boolean,
      default () {
        return true
      }
    },
    attrList: {
      type: Array,
      default () {
        return []
      }
    },
    btn_name: {
      type: String,
      default () {
        return '选择器'
      }
    },
    initData: {
      type: Object,
      default () {
        return {
          selList: [],
          dim: null,
          judge: null,
          judgeNum: null,
          judgeRange: {
            minNum: '',
            maxNum: ''
          }
        }
      }
    }
  },
  computed: {
    mult_group () {
      return findCheck(this.selectList)
    }
  },
  methods: {
    // 全选
    selectAll ({ list, check = true, current = '' }) {
      let data
      if (current) {
        const item = getNameOfData(list, current)
        data = item.children
      } else data = list
      data.forEach((ret) => {
        if (ret.children && ret.children.length) {
          ret.children.map((rec) => {
            this.$set(rec, 'check', check)
            return rec
          })
        } else this.$set(ret, 'check', check)
      })
    },
    // 删除已选
    delTag ({ list, name }) {
      const data = getNameOfData(list, name)
      if (data.children && data.children.length) {
        this.selectAll({ list, check: false, current: data.value })
      } else {
        this.$set(data, 'check', false)
      }
    },
    // 清空全部
    clearTag ({ list }) {
      clearTagOfData(list, this)
    },
    select_handle () {
      if (this.selectList.length === 0) {
        this.spinShow = true
        this.select_show = !this.select_show
        setTimeout(() => {
          this.selectList = deepCopy(this.attrList)
          this.select_init = deepCopy(this.attrList)
          this.spinShow = false
        }, 2000)
      } else {
        this.select_show = !this.select_show
      }
    },
    select_confirm () {
      this.select_show = !this.select_show
      this.selectIds = gameGroup_handle(this.selectList).ids_arr
      this.selectKeys = gameGroup_handle(this.selectList).keys_arr
      this.selectLabels = gameGroup_handle(this.selectList).labels_arr
      this.data_handel_emit()
      // this.$emit('getData', this.selectKeys, this.selectLabels, this.attr_name)
    },
    dim_change () {
      this.dimLabel = this.dimList.find((item) => item.value === this.dim).label
      this.data_handel_emit()
    },
    // 限制还是不限
    noLimit () {
      this.checked = !this.checked
      if (this.checked) {
        // 选中不限
        this.$emit('getData', '不限', this.attr_name)
        this.init_judge = null
        this.judgeNum = null
      } else {
        if (this.tip_show) this.tip_show = false
        this.$Message.info('这里有默认值哦~可以自行修改哦o(*￣▽￣*)ブ')
        this.init_judge = 1
        this.judgeNum = 1
        this.judgeLabel = '>'
        this.dim = 1
        this.dimLabel = '累计充值金额'
        this.data_handel_emit()
      }
    },
    getJudge (label, judge, numRange, content) {
      this.checked = false
      this.judgeValue = judge
      if (content) {
        this.rangeContent = content
        this.judgeRange = numRange
      } else {
        this.judgeLabel = label
      }
      this.data_handel_emit()
    },
    data_handel_emit () {
      var resObj = {}
      // ------------验证------------
      if (this.selectLabels.length === 0) {
        this.Msg = 'Tips：您忘记选择游戏组了哦o(╥﹏╥)o'
        this.tip_show = true
      } else if (this.dim === null) {
        this.Msg = 'Tips：您忘记选择累计维度了哦o(╥﹏╥)o'
        this.tip_show = true
      } else if (this.judgeNum === Infinity || this.judgeNum === 1e30) {
        this.Msg = 'Tips：您输入的数值过大o(╥﹏╥)o请重新输入哦~~'
        this.tip_show = true
      } else if (this.judgeValue !== 7 && this.judgeNum === null) {
        this.Msg = 'Tips：您输入的数值为空o(╥﹏╥)o请重新输入哦~~'
        this.tip_show = true
      } else if (
        this.judgeValue === 7 &&
        (this.rangeContent === '' || this.rangeContent === '不限')
      ) {
        this.Msg = 'Tips：您忘记输入范围了哦o(╥﹏╥)o'
        this.tip_show = true
      } else {
        // 验证通过
        if (this.tip_show) this.tip_show = false
        resObj.content = '游戏组：[' + this.selectLabels + ']的' + this.dimLabel
        if (this.judgeValue === 7) {
          // range
          resObj.content = resObj.content + '的范围在' + this.rangeContent + '区间'
          resObj.val = {
            gameIds: this.selectIds,
            selectKeys: this.selectKeys,
            selectLabels: this.selectLabels,
            dim: this.dim,
            dimLabel: this.dimLabel,
            judge: 7,
            judgeRange: this.judgeRange,
            rangeContent: this.rangeContent,
            nolimit: false
          }
        } else {
          // num
          resObj.content = resObj.content + this.judgeLabel + this.judgeNum
          resObj.val = {
            gameIds: this.selectIds,
            selectKeys: this.selectKeys,
            selectLabels: this.selectLabels,
            dim: this.dim,
            dimLabel: this.dimLabel,
            judge: this.judgeValue,
            judgeLabel: this.judgeLabel,
            judgeNum: this.judgeNum,
            nolimit: false
          }
        }
        this.$emit('getData', resObj, this.attr_name)
        return 0
      }
      this.$emit('getData', '不限', this.attr_name)
    }
  },
  watch: {
    attrList (n, o) {
      this.selectList = deepCopy(n)
      this.select_init = deepCopy(n)
      if (this.selectedList.length > 0) {
        this.clearTag({ list: this.selectList })
        this.selectList = set_gameGroup(
          this.selectedList ? this.selectedList : [],
          this.select_init
        )
        this.selectIds = gameGroup_handle(this.selectList).ids_arr
        this.selectKeys = gameGroup_handle(this.selectList).keys_arr
        this.select_confirm()
        this.select_show = true
      }
    }
  },
  created () {
    setTimeout(() => {
      this.selectList = deepCopy(this.attrList)
      this.select_init = deepCopy(this.attrList)
      this.selectedList = deepCopy(this.initData.selList)
      this.dim = this.initData.dim
      this.init_judge = this.initData.judge
      this.judgeNum = this.initData.judgeNum
      this.init_num = deepCopy(this.initData.judgeRange)
      if (this.selectedList.length > 0) {
        this.clearTag({ list: this.selectList })
        this.selectList = set_gameGroup(
          this.selectedList ? this.selectedList : [],
          this.select_init
        )
        this.selectIds = gameGroup_handle(this.selectList).ids_arr
        this.selectKeys = gameGroup_handle(this.selectList).keys_arr
        this.select_confirm()
        this.select_show = true
      }
    }, 2000)
  }
}
</script>
<style lang="stylus" scoped>
.select-div {
  margin-top: 10px;
}
.ivu-btn {
  margin-right: 10px
}
.ivu-select {
  margin-right: 10px
}
.tip-span {
  margin-left: 10px
}
</style>
