<template>
  <div class="a-check">
    <Row>
      <Col flex="110px">
        <span class="c-fix-title wt">{{ attr_name }}</span>
      </Col>
      <Col flex="90px" v-if="nolimit">
        <Button v-if="checked" type="primary" @click="noLimit">不限</Button>
        <Button v-else @click="noLimit">不限</Button>
      </Col>
      <Col flex="auto">
        <CheckboxGroup
          v-model="checked_attr"
          v-for="item in attrList"
          :key="item.id"
          @on-change="check_attr"
        >
          <Checkbox :label="item.label" border></Checkbox>
        </CheckboxGroup>
      </Col>
    </Row>
    <Divider />
  </div>
</template>
<script>
import { deepCopy } from '@/common/js/utils'
export default {
  name: 'a-check',
  components: {},
  data () {
    return {
      checked: true,
      attr_List: deepCopy(this.attrList),
      checked_attr: []
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
    attrList: {
      type: Array,
      default () {
        return []
      }
    },
    initList: {
      type: Array,
      default () {
        return []
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
        this.$emit('getData', [], this.attr_name)
      } else {
        this.$Message.info('不做任何选择，默认不限哦o(*￣▽￣*)ブ')
      }
    },
    // 选择属性check
    check_attr () {
      const checks = this.checked_attr
      if (checks.length > 0) this.checked = false
      if (checks.length === 0) this.checked = true
      this.$emit('getData', checks, this.attr_name)
    }
  },
  watch: {},
  created () {
    setTimeout(() => {
      this.attr_List = deepCopy(this.attrList)
      this.checked_attr = deepCopy(this.initList)
      this.check_attr()
    }, 500)
  }
}
</script>
<style lang="stylus" scoped>
.ivu-checkbox-group {
    display: inline-block;
}
</style>
