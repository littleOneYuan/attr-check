<template>
  <div class="attr-check">
    <Row>
      <Col flex="110px">
        <span class="c-fix-title wt">{{ attr_name }}</span>
      </Col>
      <Col flex="90px" v-if="nolimit">
        <Button v-if="checked" type="primary" @click="noLimit">不限</Button>
        <Button v-else @click="noLimit">不限</Button>
      </Col>
      <!-- 多选 -->
      <Col flex="auto" v-if="atype === 'check'">
        <CheckboxGroup
          v-model="checked_attr"
          v-for="item in checkList"
          :key="item.id"
          @on-change="check_attr"
        >
          <Checkbox :label="item.label" border></Checkbox>
        </CheckboxGroup>
      </Col>
      <!-- 选择器 -->
      <Col flex="auto" v-if="atype === 'select'">
        <Button type="primary" ghost @click="select_show = !select_show">{{
          btn_name[0]
        }}</Button>
        <Button
          v-if="btn_name.length > 1"
          type="primary"
          ghost
          @click="select_show2 = !select_show2"
          >{{ btn_name[1] }}</Button
        >
      </Col>
      <!-- 单层选择器 -->
      <Col flex="auto" v-if="atype === 'sim_select'" class="sim-sel">
        <Csearch
          :placeholder="btn_name[0]"
          :trans_unselList="attr_List"
          :trans_selList="res_attr_List"
          @func="getAttr_List"
        />
        <Csearch
          v-if="btn_name.length > 1"
          :placeholder="btn_name[1]"
          :trans_unselList="attr_List2"
          :trans_selList="res_attr_List2"
          @func="getAttr_List2"
        />
      </Col>
      <!-- VIP等级 -->
      <Col flex="auto" v-if="atype === 'level'">
        <cCompare />
      </Col>
      <!-- 充值情况 -->
      <Col flex="auto" v-if="atype === 'pay'">
        <Button type="primary" ghost @click="select_show = !select_show">{{
          btn_name[0]
        }}</Button>
        <Select v-model="dim" style="width: 140px" @on-open-change="dim_change">
          <Option v-for="item in attrBox.dimList" :value="item.value" :key="item.value">{{
            item.label
          }}</Option>
        </Select>
        <cCompare />
      </Col>
      <!-- 数字 -->
      <Col flex="auto" v-if="atype === 'num'">
        <nToN @func="setData" :num-flag="1"></nToN>
      </Col>
      <!-- 时间 -->
      <Col flex="auto" v-if="atype === 'time'">
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
      <!-- 开关 -->
      <Col flex="auto" v-if="atype === 'switch'" class="switch-col">
        <i-switch
          v-model="item.checked"
          v-for="item in switchList"
          :key="item.id"
          @on-change="switch_handle"
          size="large"
        >
          <span slot="open">{{ item.label }}</span>
          <span slot="close">{{ item.label }}</span>
        </i-switch>
      </Col>
    </Row>
    <div class="select-div" v-if="select_show">
      <selecter
        v-model="mult_group"
        :data="attrList"
        search
        :title="['一级', '二级']"
        @on-select="selectAll"
        @on-delete="delTag"
        @on-clear="clearTag"
      />
    </div>
    <div class="select-div" v-if="select_show2">
      <Divider plain orientation="right">source_id</Divider>
      <selecter
        v-model="mult_group2"
        :data="attrList2"
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
import shortcuts from '@/data/shortcuts'
import DatePick from '@/components/date-picker'
import Csearch from '@/components/c-search/index.vue'
import nToN from '@/components/numtonum/nToN'
import cCompare from '@/components/c-compare'
import attrBox from '@/data/user/attr_box'
import Selecter from '@/components/select/selecter.vue'
import {
  findCheck,
  formatDate,
  getNameOfData,
  clearTagOfData,
  deepCopy
} from '@/common/js/utils'
export default {
  name: 'attr-check',
  components: {
    nToN,
    Csearch,
    DatePick,
    cCompare,
    Selecter
  },
  data () {
    const date = new Date()
    var fday
    if (date.getMonth() < 9) {
      fday = date.getFullYear() + '-0' + (date.getMonth() + 1) + '-01'
    } else {
      fday = date.getFullYear() + '-' + (date.getMonth() + 1) + '-01'
    }
    const now = formatDate(date, 'yyyy-MM-dd') // 初始化默认时间
    return {
      select_show: false,
      select_show2: false,
      switchList: deepCopy(this.attrList),
      checkList: deepCopy(this.attrList),
      attr_List: deepCopy(this.attrList),
      res_attr_List: [],
      sel_attr_List: [],
      attr_List2: this.attrList2,
      res_attr_List2: [],
      sel_attr_List2: [],
      checked: true,
      checked_attr: [],
      hasPhone: false,
      attrBox: attrBox,
      dim: 1,
      datetime: [fday, now],
      comDate: [fday, now],
      datetimeOption: {
        shortcuts,
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      }
    }
  },
  props: {
    atype: {
      type: String,
      default () {
        return 'check'
      }
    },
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
    attrList: {
      type: Array,
      default () {
        return []
      }
    },
    attrList2: {
      type: Array,
      default () {
        return []
      }
    },
    btn_name: {
      type: Array,
      default () {
        return ['选择器']
      }
    }
  },
  computed: {
    mult_group () {
      return findCheck(this.attrList)
    },
    mult_group2 () {
      return findCheck(this.attrList2)
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
    // 限制还是不限
    noLimit () {
      this.checked = !this.checked
      if (this.checked) {
        // 选中不限
        this.$Message.info('选择不限，默认选项也就失效了哦o(*￣▽￣*)ブ')
        // swith
        if (this.atype === 'switch') {
          this.switchList.forEach((item) => {
            if (item.checked) {
              item.checked = false
            }
          })
          this.$emit('getData', [])
        }
        // swith
        if (this.atype === 'check') {
          this.checked_attr = []
          this.$emit('getData', [], this.attr_name)
        }
      } else {
        this.$Message.info('不做任何选择，默认不限哦o(*￣▽￣*)ブ')
      }
    },
    // switch处理
    switch_handle () {
      var switchs = []
      this.switchList.forEach((item) => {
        if (item.checked) {
          switchs.push(item.label)
        }
      })
      if (switchs.length > 0) this.checked = false
      if (switchs.length === 0) this.checked = true
      this.$emit('getData', switchs)
    },
    // 选择属性check
    check_attr () {
      const checks = this.checked_attr
      if (checks.length > 0) this.checked = false
      if (checks.length === 0) this.checked = true
      this.$emit('getData', checks, this.attr_name)
    },
    // 日期选择器
    handleDatetime (val) {
      this.datetime = val
    },
    confirmDatetime () {
      this.comDate = JSON.parse(JSON.stringify(this.datetime))
      setTimeout(() => {
        this.ct_query()
      }, 500)
    },
    day_clear () {
      const date = new Date()
      var fday
      if (date.getMonth() < 9) {
        fday = date.getFullYear() + '-0' + (date.getMonth() + 1) + '-01'
      } else {
        fday = date.getFullYear() + '-' + (date.getMonth() + 1) + '-01'
      }
      const now = formatDate(date, 'yyyy-MM-dd') // 初始化默认时间
      this.datetime = [fday, now]
      this.comDate = JSON.parse(JSON.stringify(this.datetime))
    },
    clearShortCut () {
      const shortCut = document.querySelectorAll('.ivu-picker-panel-shortcut')
      const len = shortCut.length
      for (let i = 0; i < len; i++) {
        shortCut[i].style.background = 'none'
      }
    },
    // 拿到选择的属性
    getAttr_List (list) {
      this.sel_attr_List = list
    },
    // 拿到选择的属性2
    getAttr_List2 (list) {
      this.sel_attr_List2 = list
    },
    dim_change () {
      console.log(this.dim, '---dim')
    },
    setData () {}
  },
  watch: {},
  created () {
    // switch (this.atype) {
    //   case 'switch':
    //     this.switchList = deepCopy(this.attrList)
    //     break
    //   case 'check':
    //     this.checkList = deepCopy(this.attrList)
    //     break
    // }
  }
}
</script>
<style lang="stylus" scoped>
.ivu-row {
  margin-top: 8px;
}
.select-div {
  margin-top: 10px;
}
.ivu-btn {
  margin-right: 10px
}
.ivu-select {
  margin-right: 10px
}
// switch
.switch-col {
  display: flex
  justify-content: space-between
}
.ivu-switch {
  width: 96px;
  height: 30px;
  line-height: 26px;
  border-radius: 30px;
  border: 1.5px solid #9ba5b7;
  background-color: #9ba5b7;
}
.ivu-switch:after {
  content: '无'
  color: #7da3c7;
  font-weight: 600
  font-size: 16px
  text-align: center
  width: 24px;
  height: 24px;
  border-radius: 27px;
  left: 1.5px;
  top: 1.5px;
  transition: left 0.4s ease-in-out, width 0.4s ease-in-out;
}
.ivu-switch-checked:after {
  content: '有'
}
.ivu-switch-checked {
  border-color: #7da3c7;
  background-color: #7da3c7;
}
.ivu-switch-large.ivu-switch-checked:after {
  left: 67.5px;
}
/deep/ .ivu-switch-inner {
  font-size: 14px;
  // color: #7da3c7;
  left: 30px;
  transition: left 0.4s ease-in-out;
}
/deep/ .ivu-switch-checked .ivu-switch-inner {
  left: 6px;
  color: #fff;
}
.sim-sel {
  &>div {
    display: inline-block
    margin-right: 10px
  }
}
/deep/.ivu-picker-confirm>.ivu-btn:first-child {
  display: none;
}
</style>
