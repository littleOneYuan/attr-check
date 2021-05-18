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
        <Button
          v-if="!select_show && !checked"
          type="primary"
          ghost
          @click="select_handle"
          >{{ btn_name }}</Button
        >
        <Button v-if="select_show && !checked" type="primary" @click="select_confirm"
          >点我选项生效！！！</Button
        >
      </Col>
    </Row>
    <div class="select-div" v-if="select_show && !checked">
      <Spin size="large" fix v-if="spinShow"></Spin>
      <selecter
        v-else
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
import {
  gameGroup_handle,
  set_gameGroupcopy,
  gameGroup_tail
} from '@/common/js/c_common'
import Selecter from '@/components/select/selecter.vue'
import {
  findCheck,
  getNameOfData,
  getKeyOfData,
  clearTagOfData,
  deepCopy
} from '@/common/js/utils'
export default {
  name: 'a-select',
  components: {
    Selecter
  },
  data () {
    return {
      checked: false,
      select_show: false,
      spinShow: false,
      selectList: [],
      select_init: [],
      selectLabels: [],
      selectKeys: [],
      selectIds: [],
      selectedList: []
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
    selList: {
      type: Array,
      default () {
        return []
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
      // 这里的name其实已经是key了
      const data = getKeyOfData(list, 'key', name)
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
        if (this.attr_name === '渠道') {
          this.spinShow = true
          setTimeout(() => {
            this.spinShow = false
          }, 1000)
        }
      }
    },
    select_confirm () {
      this.select_show = !this.select_show
      if (this.attr_name === '渠道') {
        this.selectIds = gameGroup_handle(this.selectList).ids_arr
      } else {
        this.selectIds = gameGroup_tail(this.selectList).ids_arr
      }
      this.selectKeys = gameGroup_handle(this.selectList).keys_arr
      this.selectLabels = gameGroup_handle(this.selectList).labels_arr
      this.$emit(
        'getData',
        this.selectIds,
        this.selectKeys,
        this.selectLabels,
        this.attr_name
      )
    },
    noLimit () {
      this.checked = !this.checked
      if (this.checked) {
        // 选中不限
        this.$emit('getData', [], [], [], this.attr_name)
      } else {
        this.$Message.info('不做任何选择，默认不限哦o(*￣▽￣*)ブ')
      }
    }
  },
  watch: {
    attrList (n, o) {
      this.selectList = deepCopy(n)
      this.select_init = deepCopy(n)
      if (this.selectedList.length > 0) {
        this.clearTag({ list: this.selectList })
        set_gameGroupcopy(
          this.selectedList ? this.selectedList : [],
          this.selectList,
          false,
          this
        )
        if (this.attr_name === '渠道') {
          this.selectIds = gameGroup_handle(this.selectList).ids_arr
        } else {
          this.selectIds = gameGroup_tail(this.selectList).ids_arr
        }
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
      this.selectedList = deepCopy(this.selList)
      if (this.selectedList.length > 0) {
        this.clearTag({ list: this.selectList })
        set_gameGroupcopy(
          this.selectedList ? this.selectedList : [],
          this.selectList,
          false,
          this
        )
        if (this.attr_name === '渠道') {
          this.selectIds = gameGroup_handle(this.selectList).ids_arr
        } else {
          this.selectIds = gameGroup_tail(this.selectList).ids_arr
        }
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
</style>
