<template>
  <div class="a-sim-select">
    <Row>
      <Col flex="110px">
        <span class="c-fix-title wt">{{ attr_name }}</span>
      </Col>
      <Col flex="90px" v-if="nolimit">
        <Button v-if="checked" type="primary" @click="noLimit">不限</Button>
        <Button v-else @click="noLimit">不限</Button>
      </Col>
      <!-- 单层选择器 -->
      <Col flex="auto" class="sim-sel">
        <Csearch
          v-if="!checked"
          :placeholder="btn_name"
          :trans_unselList="attr_List"
          :trans_selList="res_attr_List"
          @func="getAttr_List"
        />
      </Col>
    </Row>
    <Divider />
  </div>
</template>
<script>
import Csearch from '@/components/c-search/index.vue'
import { deepCopy } from '@/common/js/utils'
export default {
  name: 'a-sim-select',
  components: {
    Csearch
  },
  data () {
    return {
      checked: true,
      attr_List: [],
      res_attr_List: deepCopy(this.init_selList),
      sel_attr_List: []
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
    btn_name: {
      type: String,
      default () {
        return '请选择'
      }
    },
    attrList: {
      type: Array,
      default () {
        return []
      }
    },
    init_selList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    // 限制还是不限
    noLimit () {
      this.checked = !this.checked
      if (this.checked) {
        // 选中不限
        this.$emit('getData', [], [], this.attr_name)
      } else {
        this.$Message.info('不做任何选择，默认不限哦o(*￣▽￣*)ブ')
      }
    },
    // 拿到选择的属性
    getAttr_List (list, lables) {
      this.sel_attr_List = list
      this.$emit('getData', this.sel_attr_List, lables, this.attr_name)
    }
  },
  watch: {},
  created () {
    setTimeout(() => {
      this.checked = false
      this.attr_List = deepCopy(this.attrList)
      this.res_attr_List = deepCopy(this.init_selList)
    }, 1000)
  }
}
</script>
<style lang="stylus" scoped>
.sim-sel {
  &>div {
    display: inline-block
    margin-right: 10px
  }
}
</style>
