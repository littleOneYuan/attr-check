<template>
  <div class="add-condition">
    <span class="c-fix-title wt">{{ attr_name }}</span>
    <Form ref="formAttr" :model="formAttr" :label-width="60" style="width: 100%">
      <FormItem v-for="(item, index) in formAttr.item" :key="index">
        <template v-if="item.status">
          <Row>
            <Col span="24">
              <Select
                v-model="item.seedim"
                style="width: 80px"
                @on-open-change="dim_change($event, item.seedim, index)"
              >
                <Option
                  v-for="see_item in seedimList"
                  :value="see_item.value"
                  :key="see_item.value"
                  >{{ see_item.label }}</Option
                >
              </Select>
              <Select
                v-if="item.seedim !== 3"
                v-model="item.scompare"
                style="width: 80px"
                @on-open-change="scom_change($event, item.scompare, index)"
              >
                <Option
                  v-for="j_item in judgeList"
                  :value="j_item.value"
                  :key="j_item.value"
                  >{{ j_item.label }}</Option
                >
              </Select>
              <InputNumber
                v-if="item.seedim !== 3 && item.scompare !== 7"
                :min="1"
                v-model="item.sNum"
                @on-blur="get_sNum(item.sNum, index)"
              ></InputNumber>
              <nToN
                v-if="item.seedim !== 3 && item.scompare === 7"
                :initNum="item.seerange"
                @func="see_setData($event, index)"
                :num-flag="1"
              ></nToN>
              <Select
                v-if="item.seedim !== 3"
                v-model="item.suffix"
                placeholder="统计维度"
                style="width: 120px; margin-left: 6px"
                @on-open-change="suffix_change($event, item.suffix, index)"
              >
                <Option
                  v-for="suf_item in sufList"
                  :value="suf_item.value"
                  :key="suf_item.value"
                  >{{ suf_item.label }}</Option
                >
              </Select>
              <Select
                v-if="item.seedim === 3"
                v-model="item.selsuf"
                placeholder="统计维度"
                style="width: 140px"
                @on-open-change="selsuf_change($event, item.selsuf, index)"
              >
                <Option
                  v-for="sel_item in selsufList"
                  :value="sel_item.value"
                  :key="sel_item.value"
                  >{{ sel_item.label }}</Option
                >
              </Select>
              <date-pick
                v-if="item.selsuf_type === 'time'"
                type="daterange"
                :value="item.datetime"
                :options="datetimeOption"
                confirm
                :clearable="false"
                :editable="false"
                split-panels
                :transfer="false"
                @on-change="handleDatetime($event, index)"
                @on-ok="confirmDatetime(index)"
                @on-clear="day_clear(index)"
                @on-clear-shortcut="clearShortCut"
                placement="bottom-start"
                placeholder="请选择查询日期范围"
                style="width: 200px"
              />
              <Select
                v-if="item.selsuf_type === 'num'"
                v-model="item.compare"
                style="width: 80px"
                @on-open-change="com_change($event, item.compare, index)"
              >
                <Option
                  v-for="com_item in judgeList"
                  :value="com_item.value"
                  :key="com_item.value"
                  >{{ com_item.label }}</Option
                >
              </Select>
              <InputNumber
                v-if="item.selsuf_type === 'num' && item.compare !== 7"
                :max="10"
                :min="1"
                v-model="item.cNum"
                @on-blur="get_cNum(item.cNum, index)"
              ></InputNumber>
              <nToN
                v-if="item.selsuf_type === 'num' && item.compare === 7"
                :initNum="item.comrange"
                @func="com_setData($event, index)"
                :num-flag="1"
              ></nToN>
              <Button
                type="primary"
                icon="md-close"
                ghost
                :disabled="index === 0"
                @click="handleRemove(item, index)"
              ></Button>
              <Button
                type="primary"
                icon="md-checkmark"
                @click="handleConfirm(item, index)"
              ></Button>
              <span v-show="item.tip_show" class="tip-span">{{ item.msg }}</span>
            </Col>
          </Row>
        </template>
      </FormItem>
      <FormItem>
        <Row style="margin-bottom: 0px">
          <Col span="3">
            <Button type="dashed" @click="handleAdd" icon="md-add">增加条件</Button>
          </Col>
        </Row>
      </FormItem>
    </Form>
    <Divider />
  </div>
</template>
<script>
import shortcuts from '@/data/shortcuts'
import DatePick from '@/components/date-picker'
import attrBox from '@/data/user/attr_box'
import nToN from '@/components/numtonum/nToN'
import { ntnData_handle, commit_range_handle, deepCopy } from '@/common/js/c_common'
export default {
  name: 'add-condition',
  components: {
    DatePick,
    nToN
  },
  props: {
    attr_name: {
      type: String,
      default () {
        return '属性名'
      }
    },
    initData: {
      type: Array,
      default () {
        return []
      }
    },
    isCreate: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  data () {
    var sufList = attrBox.suf_active
    var selsufList = attrBox.selsuf_active
    switch (this.attr_name) {
      case '活跃':
        sufList = attrBox.suf_active
        selsufList = attrBox.selsuf_active
        break
      case '登录':
        sufList = attrBox.suf_login
        selsufList = attrBox.selsuf_login
        break
      case '充值':
        sufList = attrBox.suf_pay
        selsufList = attrBox.selsuf_pay
        break
    }
    return {
      index: 1,
      attrBox: attrBox,
      sufList: sufList,
      selsufList: selsufList,
      seedimList: attrBox.seedimList,
      judgeList: attrBox.judgeList,
      resObjArr: [],
      formAttr: {
        item: this.initData
      },
      datetimeOption: {
        shortcuts,
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      }
    }
  },
  methods: {
    handleAdd () {
      this.index++
      this.formAttr.item.push({
        index: this.index,
        status: 1,
        seedim: 1,
        seedim_label: '注册',
        scompare: 1,
        scompare_label: '>',
        sNum: 3,
        seerange: {
          minNum: '',
          maxNum: ''
        },
        seerange_content: '',
        suffix: '',
        suffix_label: '',
        selsuf_type: 'num',
        selsuf: '',
        selsuf_label: '',
        datetime: ['', ''],
        comDate: ['', ''],
        compare: 1,
        compare_label: '>',
        cNum: 3,
        comrange: {
          minNum: '',
          maxNum: ''
        },
        comrange_content: '',
        tip_show: false,
        msg: ''
      })
    },
    handleRemove (line, index) {
      this.formAttr.item[index].status = 0
      this.resObjArr = this.resObjArr.filter((item) => item.index !== line.index)
      if (this.resObjArr.length === 0) {
        this.$emit('getData', '不限', this.attr_name)
      } else {
        this.$emit('getData', this.resObjArr, this.attr_name)
      }
    },
    dim_change (open, seedim, idx) {
      if (!open) {
        var label = ''
        if (seedim !== 3) {
          label = this.seedimList.find((item) => item.value === seedim).label
        }
        this.formAttr.item[idx].seedim_label = label
      }
    },
    scom_change (open, scompare, idx) {
      if (!open) {
        var label = ''
        if (scompare !== 7) {
          label = this.judgeList.find((item) => item.value === scompare).label
        }
        this.formAttr.item[idx].scompare_label = label
      }
    },
    get_sNum (sNum, idx) {
      if (typeof sNum === 'number') {
      } else {
        this.$Message.info('这里有默认值哦~可以自行修改哦o(*￣▽￣*)ブ')
        this.formAttr.item[idx].sNum = 1
      }
    },
    see_setData (data, idx) {
      var seeContent = ntnData_handle(data).content
      var seeRange = ntnData_handle(data).range
      console.log(seeContent, '---seeContent')
      console.log(seeRange, '---seeRange')
      this.formAttr.item[idx].seerange = seeRange
      this.formAttr.item[idx].seerange_content = seeContent
    },
    suffix_change (open, suffix, idx) {
      if (!open && typeof suffix === 'number') {
        var label = ''
        console.log(suffix, '--suffix')
        console.log(typeof suffix, '--suffix')
        label = this.sufList.find((item) => item.value === suffix).label
        console.log(label, '---suffix_label')
        this.formAttr.item[idx].suffix_label = label
      }
    },
    selsuf_change (open, selsuf, idx) {
      if (!open) {
        var label = ''
        label = this.selsufList.find((item) => item.value === selsuf).label
        console.log(label, '---selsuf_label')
        this.formAttr.item[idx].selsuf_label = label
        this.formAttr.item[idx].selsuf_type = label.includes('时间') ? 'time' : 'num'
      }
    },
    com_change (open, compare, idx) {
      if (!open) {
        var label = ''
        if (compare !== 7) {
          label = this.judgeList.find((item) => item.value === compare).label
        }
        this.formAttr.item[idx].compare_label = label
      }
    },
    get_cNum (cNum, idx) {
      if (typeof cNum === 'number') {
      } else {
        this.$Message.info('这里有默认值哦~可以自行修改哦o(*￣▽￣*)ブ')
        this.formAttr.item[idx].cNum = 1
      }
    },
    com_setData (data, idx) {
      var comContent = ntnData_handle(data).content
      var comRange = ntnData_handle(data).range
      console.log(comContent, '---comContent')
      console.log(comRange, '---comRange')
      this.formAttr.item[idx].comrange = comRange
      this.formAttr.item[idx].comrange_content = comContent
    },
    handleConfirm (line, index) {
      console.log(line, '---line', index)
      this.data_handel_emit(line, index)
    },
    data_handel_emit (line, idx) {
      var resObj = {}
      var lineType
      // ------------验证------------
      if (line.seedim !== 3 && !line.suffix) {
        this.formAttr.item[idx].msg = 'Tips：您忘记选择统计维度了哦o(╥﹏╥)o'
        this.formAttr.item[idx].tip_show = true
      } else if (line.seedim === 3 && !line.selsuf) {
        this.formAttr.item[idx].msg = 'Tips：您忘记选择统计维度了哦o(╥﹏╥)o'
        this.formAttr.item[idx].tip_show = true
      } else if (
        line.seedim === 3 &&
        line.selsuf_type === 'time' &&
        line.comDate[0] === ''
      ) {
        this.formAttr.item[idx].msg = 'Tips：您忘记选择时间范围了哦o(╥﹏╥)o'
        this.formAttr.item[idx].tip_show = true
      } else if (line.scompare === 7 && line.seerange_content === '') {
        this.formAttr.item[idx].msg = 'Tips：您忘记输入范围了哦o(╥﹏╥)o'
        this.formAttr.item[idx].tip_show = true
      } else if (line.compare === 7 && line.comrange_content === '') {
        this.formAttr.item[idx].msg = 'Tips：您忘记输入范围了哦o(╥﹏╥)o'
        this.formAttr.item[idx].tip_show = true
      } else {
        // 验证通过
        if (this.formAttr.item[idx].tip_show) {
          this.formAttr.item[idx].tip_show = false
        }
        // ------------类型判断------------
        if (line.seedim !== 3 && line.scompare !== 7 && line.compare !== 7) {
          lineType = 111
        } else if (line.seedim !== 3 && line.scompare !== 7 && line.compare === 7) {
          lineType = 112
        } else if (line.seedim !== 3 && line.scompare === 7 && line.compare !== 7) {
          lineType = 121
        } else if (line.seedim !== 3 && line.scompare === 7 && line.compare === 7) {
          lineType = 122
        } else if (
          line.seedim === 3 &&
          line.selsuf_type === 'num' &&
          line.compare !== 7
        ) {
          lineType = 211
        } else if (
          line.seedim === 3 &&
          line.selsuf_type === 'num' &&
          line.compare === 7
        ) {
          lineType = 212
        } else if (line.seedim === 3 && line.selsuf_type === 'time') {
          lineType = 221
        }
        // ------------内容填充------------
        switch (lineType) {
          case 111:
            resObj.index = line.index
            resObj.content =
              line.seedim_label +
              line.scompare_label +
              line.sNum +
              line.suffix_label +
              line.compare_label +
              line.cNum
            resObj.val = {
              seedim: line.seedim,
              seedim_label: line.seedim_label,
              scompare: line.scompare,
              scompare_label: line.scompare_label,
              sNum: line.sNum,
              suffix: line.suffix,
              suffix_label: line.suffix_label,
              compare: line.compare,
              compare_label: line.compare_label,
              cNum: line.cNum
            }
            break
          case 112:
            resObj.index = line.index
            resObj.content =
              line.seedim_label +
              line.scompare_label +
              line.sNum +
              line.suffix_label +
              '范围在' +
              line.comrange_content
            resObj.val = {
              seedim: line.seedim,
              seedim_label: line.seedim_label,
              scompare: line.scompare,
              scompare_label: line.scompare_label,
              sNum: line.sNum,
              suffix: line.suffix,
              suffix_label: line.suffix_label,
              compare: line.compare,
              comrange: line.comrange,
              comrange_content: line.comrange_content
            }
            break
          case 121:
            resObj.index = line.index
            resObj.content =
              line.seedim_label +
              line.seerange_content +
              line.suffix_label +
              line.compare_label +
              line.cNum
            resObj.val = {
              seedim: line.seedim,
              seedim_label: line.seedim_label,
              scompare: line.scompare,
              seerange: line.seerange,
              seerange_content: line.seerange_content,
              suffix: line.suffix,
              suffix_label: line.suffix_label,
              compare: line.compare,
              compare_label: line.compare_label,
              cNum: line.cNum
            }
            break
          case 122:
            resObj.index = line.index
            resObj.content =
              line.seedim_label +
              line.seerange_content +
              line.suffix_label +
              '范围在' +
              line.comrange_content
            resObj.val = {
              seedim: line.seedim,
              seedim_label: line.seedim_label,
              scompare: line.scompare,
              seerange: line.seerange,
              seerange_content: line.seerange_content,
              suffix: line.suffix,
              suffix_label: line.suffix_label,
              compare: line.compare,
              comrange: line.comrange,
              comrange_content: line.comrange_content
            }
            break
          case 211:
            resObj.index = line.index
            resObj.content = line.selsuf_label + line.compare_label + line.cNum
            resObj.val = {
              seedim: line.seedim,
              selsuf: line.selsuf,
              selsuf_label: line.selsuf_label,
              compare: line.compare,
              compare_label: line.compare_label,
              cNum: line.cNum
            }
            break
          case 212:
            resObj.index = line.index
            resObj.content = line.selsuf_label + '范围在' + line.comrange_content
            resObj.val = {
              seedim: line.seedim,
              selsuf: line.selsuf,
              selsuf_label: line.selsuf_label,
              compare: line.compare,
              comrange: line.comrange,
              comrange_content: line.comrange_content
            }
            break
          case 221:
            resObj.index = line.index
            resObj.content =
              line.selsuf_label + '范围在' + line.comDate[0] + '至' + line.comDate[1]
            resObj.val = {
              seedim: line.seedim,
              selsuf: line.selsuf,
              selsuf_label: line.selsuf_label,
              datetime: line.datetime,
              comDate: line.comDate,
              selsuf_type: line.selsuf_type
            }
            break
        }
        if (
          !this.resObjArr.some(
            (item) => item.index === line.index && item.content === resObj.content
          )
        ) {
          this.resObjArr = this.resObjArr.filter((item) => item.index !== line.index)
          this.resObjArr.push(resObj)
          this.$emit('getData', this.resObjArr, this.attr_name)
        }
      }
      if (this.resObjArr.length === 0) {
        this.$emit('getData', '不限', this.attr_name)
      }
    },
    // 日期选择器
    handleDatetime (val, idx) {
      this.formAttr.item[idx].datetime = val
    },
    confirmDatetime (idx) {
      this.formAttr.item[idx].comDate = JSON.parse(
        JSON.stringify(this.formAttr.item[idx].datetime)
      )
      // this.$emit('getData', this.comDate, this.attr_name)
    },
    day_clear (idx) {
      this.formAttr.item[idx].datetime = ['', '']
      this.formAttr.item[idx].comDate = JSON.parse(
        JSON.stringify(this.formAttr.item[idx].datetime)
      )
      // this.$emit('getData', this.comDate, this.attr_name)
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
    // this.formAttr.item = this.initData
    console.log(this.formAttr, '---this.formAttr')
    // 赋初值
    setTimeout(() => {
      if (!this.isCreate) {
        // 复制
        this.formAttr.item = this.initData
        this.index = this.formAttr.item.length
        let idx = 0
        this.formAttr.item.forEach((line) => {
          this.dim_change(false, line.seedim, idx)
          this.scom_change(false, line.scompare, idx)
          this.com_change(false, line.compare, idx)
          var line_copy = deepCopy(line)
          line_copy.seerange = commit_range_handle(line_copy.seerange)
          line_copy.comrange = commit_range_handle(line_copy.comrange)
          this.handleConfirm(line_copy, idx)
          idx++
        })
      }
    }, 1800)
  }
}
</script>
<style lang="stylus" scoped>
.add-condition {
  position: relative
}
.c-fix-title {
  position: absolute
  top: 4px
}
.ivu-form-item {
  margin-bottom: 0px;
}
.ivu-row {
  margin-bottom: 24px;
}
.ivu-select {
  margin-right: 6px
}
.ivu-btn {
  margin-left: 4px
}
.ivu-btn-dashed {
  margin: 0px
};
</style>
