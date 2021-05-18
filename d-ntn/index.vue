<template>
  <div class="a-ntn">
    <Row>
      <Col flex="110px">
        <span class="c-fix-title wt">{{ attr_name }}</span>
      </Col>
      <Col flex="auto">
        <c-ntn @func="setData" :initNum="init_num"></c-ntn>
      </Col>
    </Row>
    <Divider />
  </div>
</template>
<script>
import cNtn from '@/components/c-ntn'
import { cntnData_handle, deepCopy } from '@/common/js/c_common'
export default {
  name: 'a-ntn',
  components: {
    cNtn
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
          min: null,
          max: null
        }
      }
    }
  },
  computed: {},
  methods: {
    setData (data) {
      var content = cntnData_handle(data).content
      var range = cntnData_handle(data).range
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
