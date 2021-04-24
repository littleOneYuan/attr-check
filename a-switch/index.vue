<template>
  <div class="a-switch">
    <Row>
      <Col flex="110px">
        <span class="c-fix-title wt">{{ attr_name }}</span>
      </Col>
      <Col flex="90px" v-if="nolimit">
        <Button v-if="checked" type="primary" @click="noLimit">不限</Button>
        <Button v-else @click="noLimit">不限</Button>
      </Col>
      <Col flex="auto" class="switch-col">
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
    <Divider />
  </div>
</template>
<script>
import { deepCopy } from '@/common/js/utils'
export default {
  name: 'a-switch',
  components: {},
  data () {
    return {
      checked: true,
      switchList: deepCopy(this.attrList)
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
    }
  },
  computed: {},
  methods: {
    // 限制还是不限
    noLimit () {
      this.checked = !this.checked
      if (this.checked) {
        // 选中不限
        this.switchList.forEach((item) => {
          if (item.checked) {
            item.checked = false
          }
        })
        this.$emit('getData', [])
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
    }
  },
  watch: {},
  created () {}
}
</script>
<style lang="stylus" scoped>
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
</style>
