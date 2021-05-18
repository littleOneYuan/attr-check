<template>
  <div class="c-selecter">
    <Row>
      <Col ref="bar" :span="maxCol" class="c-select-box">
        <Row class="c-select-flex">
          <Col
            v-for="(box, idx) in resource"
            :span="col"
            :key="idx"
            class="c-selecter-item"
          >
            <select-item
              v-model="box.keyword"
              :title="box.title"
              :disabled="disabled"
              :search="search"
            >
              <select-box
                v-model="box.current"
                :data="box.data"
                :level="box.level"
                :keyword="box.keyword"
                :disabled="disabled"
                @on-checked="handleCheck"
                @on-child="pushChild"
                @on-select="selectAll"
              />
            </select-item>
          </Col>
        </Row>
      </Col>
      <Col span="7" offset="1">
        <select-item
          v-if="resultLen && transfer"
          :title="resultTitle"
          :search="search"
          clear
          @on-clear="$emit('on-clear', { list: data })"
        >
          <div v-for="item in result" :key="item.key" class="c-pop-tip">
            <Tag :name="item.key" closable class="c-tag-item" @on-close="handleClose">{{
              item.value
            }}</Tag>
          </div>
        </select-item>
      </Col>
    </Row>
  </div>
</template>
<script>
import SelectItem from './select-item.vue'
import SelectBox from './select-box.vue'
export default {
  name: 'selecter',
  components: { SelectItem, SelectBox },
  props: {
    value: {
      type: Array
    },
    title: {
      type: Array
    },
    data: {
      type: Array
    },
    transfer: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    resourceTitle: {
      type: Boolean
    },
    search: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number
    }
  },
  data () {
    return {
      resource: []
    }
  },
  computed: {
    maxCol () {
      return this.transfer ? 16 : 24
    },
    col () {
      return 24 / this.resource.length
    },
    result () {
      return this.value
    },
    resultLen () {
      return Boolean(this.value.length)
    },
    resultTitle () {
      return `已选${
        this.resultLen
          ? '(' + this.value.length + (this.max ? `/${this.max}` : '') + ')'
          : ''
      }`
    }
  },
  watch: {
    data (nVal) {
      if (nVal && nVal.length) this.updateResource()
      else this.resource = []
    }
  },
  methods: {
    updateResource () {
      this.resource = []
      this.resource.push({
        data: this.data,
        current: '',
        keyword: '',
        level: 1,
        title: this.title[0]
      })
    },
    handleClose (event, name) {
      this.$emit('on-delete', { list: this.data, name })
    },
    // 单个选项已完成改变
    handleCheck (params) {
      this.$emit('on-checked', params)
    },
    selectAll ({ level, check, cat, key }) {
      const index = level - 2
      let current = ''
      let id = 0
      // 第二级开始计算
      if (index > -1) {
        const child = this.resource[index].data
          .filter((ret) => ret.value === current)
          .pop()
        current = this.resource[index].current
        child && (id = child.id)
      }
      cat && (current = cat)
      key && (id = key)
      this.$emit('on-select', {
        check,
        current,
        id,
        list: this.data
      })
      this.$emit('on-checked', {
        level: level,
        name: cat,
        key,
        check
      })
    },
    pushChild (params) {
      const { item, level } = params
      const len = this.resource.length
      if (level <= len - 1) {
        this.resource.splice(level, len - level)
      }
      this.resource.push({
        data: item.children,
        current: '',
        keyword: '',
        level: level + 1,
        title: this.title[level] || item.value
      })
      this.resource[level - 1].current = item.value
      if (this.resourceTitle) {
        this.$emit('on-title', this.currents(level)) // 根据resource的currrent显示标题
        const boolBar = this.$refs.bar && this.$refs.bar.$el
        if (boolBar && typeof boolBar.scrollLeft === 'number') {
          this.$nextTick(() => {
            boolBar.scrollLeft = 2020
          })
        }
      }
    },
    currents (index) {
      const arr = []
      while (--index > -1) {
        arr.push(this.resource[index].current)
      }
      return arr
    }
  },
  created () {
    this.updateResource()
  }
}
</script>
<style lang="stylus" scoped>
@import "~common/styles/mixin"

.c-selecter
  position relative
  .c-select-box
    border solid 1px #dee4f5
    overflow-x auto
    .c-select-flex
      display flex
      flex-wrap nowrap
      .c-selecter-item
        min-width 200px
        display inline-block
        border-left solid 1px #dee4f5
        &:first-child
          border-left none
  .c-pop-tip
    width 100%
  .c-tag-item
    width 90%
    margin 8px 8px 0
    padding 2px 6px
    display block
    font-size 14px
    height 28px
    >>> span.ivu-tag-text
      $no-wrap()
      max-width 90%
      display inline-block
  >>> .ivu-checkbox-wrapper
    .ivu-checkbox
      margin-right 0
</style>
