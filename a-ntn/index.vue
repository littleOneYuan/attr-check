<template>
  <div class="a-ntn">
    <Row>
      <Col flex="110px">
        <span class="c-fix-title wt">{{ attr_name }}</span>
      </Col>
      <Col flex="auto">
        <nToN @func="setData"></nToN>
      </Col>
    </Row>
    <Divider />
  </div>
</template>
<script>
import nToN from '@/components/numtonum/nToN'
export default {
  name: 'a-ntn',
  components: {
    nToN
  },
  data () {
    return {}
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
    }
  },
  computed: {},
  methods: {
    setData (data) {
      var content = ''
      var left = data[0]
      var right = data[1]
      if (left === right && left !== '') {
        // = num
        content = '=' + left
      } else if (left === '' && right === '') {
        // 不限
        content = '不限'
      } else if (left === '' && right !== '') {
        // [0, num)
        left = 0
        content = '[' + left + ',' + right + ')'
      } else if (left !== '' && right === '') {
        // [num, 不限)
        right = '不限'
        content = '[' + left + ',' + right + ')'
      }
      this.$emit('getData', content, this.attr_name)
    }
  },
  watch: {},
  created () {}
}
</script>
<style lang="stylus" scoped></style>
