<template>
  <div class="a-select">
    <Row>
      <Col flex="110px">
        <span class="c-fix-title wt">{{ attr_name }}</span>
      </Col>
      <Col flex="90px" v-if="nolimit">
        <Button v-if="checked" type="primary" @click="noLimit">不限</Button>
        <Button v-else @click="noLimit">不限</Button>
      </Col>
      <Col flex="auto">
        <Button v-if="!select_show" type="primary" ghost @click="select_handle">{{
          btn_name
        }}</Button>
        <Button v-if="select_show" type="primary" @click="select_confirm">确认</Button>
      </Col>
    </Row>
    <div class="select-div" v-if="select_show">
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
import { gameGroup_handle } from '@/common/js/c_common'
import Selecter from '@/components/select/selecter.vue'
import { findCheck, getNameOfData, clearTagOfData, deepCopy } from '@/common/js/utils'
export default {
  name: 'a-select',
  components: {
    Selecter
  },
  data () {
    return {
      checked: true,
      select_show: false,
      selectList: deepCopy(this.attrList),
      select_init: deepCopy(this.attrList),
      selectLabels: [],
      selectKeys: []
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
      this.select_show = !this.select_show
    },
    select_confirm () {
      // console.log(this.selectList, '---sele')
      this.select_show = !this.select_show
      this.selectKeys = gameGroup_handle(this.selectList).keys_arr
      this.selectLabels = gameGroup_handle(this.selectList).labels_arr
      // this.selectComIds = gameGroup_handle(this.gameGroup).combineids_arr
      // console.log(this.selectKeys, '---selectKeys')
      // console.log(this.selectLabels, '---selectLabels')
      this.$emit('getData', this.selectKeys, this.selectLabels, this.attr_name)
    },
    noLimit () {
      this.checked = !this.checked
    }
  },
  watch: {},
  created () {}
}
</script>
<style lang="stylus" scoped>
.select-div {
  margin-top: 10px;
}
.ivu-btn {
  margin-right: 10px
}
</style>
