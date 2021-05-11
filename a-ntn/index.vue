<template>
  <div class="a-ntn">
    <Row>
      <Col flex="110px">
        <span class="c-fix-title wt">{{ attr_name }}</span>
      </Col>
      <Col flex="auto">
        <nToN @func="setData" :initNum="init_num"></nToN>
      </Col>
    </Row>
    <Divider />
  </div>
</template>
<script>
import nToN from '@/components/numtonum/nToN'
import { ntnData_handle, deepCopy } from '@/common/js/c_common'
export default {
  name: 'a-ntn',
  components: {
    nToN
  },
  data () {
    return {
      init_num: deepCopy(this.initNum)
    }
  },
  props: {
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
    initNum: {
      type: Object,
      default () {
        return {
          minNum: '',
          maxNum: ''
        }
      }
    }
  },
  computed: {},
  methods: {
    setData (data) {
      var content = ntnData_handle(data).content
      var range = ntnData_handle(data).range
      this.$emit('getData', content, this.attr_name, range)
    }
  },
  watch: {},
  created () {
    setTimeout(() => {
      this.init_num = deepCopy(this.initNum)
    }, 800)
  }
}
</script>
<style lang="stylus" scoped></style>
