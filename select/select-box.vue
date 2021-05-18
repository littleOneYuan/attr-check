<template>
  <div class="c-nodata" v-if="nodata">
    <Icon type="ios-filing-outline" size="92" color="#efefef" />
  </div>
  <div class="c-select-box" v-else>
    <div class="c-check-all" :class="{'c-check-item-disable': someDisabled}">
      <div class="c-item-select c-cataract" @click="selectAll"></div>
      <Checkbox class="c-check-item" :disabled="someDisabled" v-model="all">全选</Checkbox>
    </div>
    <div v-for="item in drops" :key="item.id">
      <div v-if="item.children && item.children.length" :class="itemClasses(item)" @click="$emit('on-child', {item, level})">
        <Checkbox v-model="item.check" :indeterminate="itemIndeterminate(item)" :disabled="curDisabled(item)" style="margin: 0"></Checkbox>
        <span> {{item.value}}</span>
        <Icon type="ios-arrow-forward" class="c-check-arrow" size="14" color="#c1c1c1" />
        <span class="c-item-checkbox c-cataract" @click="selectItem(item)"></span>
      </div>
      <Checkbox v-else class="c-check-item" v-model="item.check" :disabled="curDisabled(item)" @on-change="selectCheck(...arguments, item)">{{item.value}}</Checkbox>
    </div>
  </div>
</template>
<script>
import { computeChild, trim, isEmpty } from '@/common/js/utils'
export default {
  name: 'selectBox',
  props: {
    value: {
      type: [String, Number]
    },
    data: {
      type: Array
    },
    level: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    keyword: {
      type: [String, Number]
    }
  },
  computed: {
    itemClasses () {
      return item => {
        const cls = ['c-check-item']
        item.value === this.value && cls.push('active')
        this.disabled && cls.push('c-check-item-disable')
        return cls
      }
    },
    all () {
      const len = this.data.filter(ret => ret.check).length
      return this.data.length === len
    },
    drops () {
      const keyword = trim(this.keyword).toLowerCase()
      return this.data.filter(ret => isEmpty(keyword) || ret.value.toLowerCase().includes(keyword))
    },
    nodata () {
      const no = Boolean(this.drops.length)
      return !no
    },
    curDisabled () {
      return box => {
        return this.disabled || box.disabled
      }
    },
    someDisabled () {
      return this.disabled || this.data.some(ret => ret.disabled)
    }
  },
  methods: {
    selectAll () {
      if (this.someDisabled) return
      this.$emit('on-select', {
        check: !this.all,
        level: this.level
      })
    },
    selectItem (item) {
      if (this.curDisabled(item)) return
      this.$emit('on-select', {
        check: !item.check,
        level: this.level,
        cat: item.value,
        key: item.key
      })
    },
    selectCheck () {
      const [val, item] = arguments
      if (val) this.$set(item, '_time', Date.now()) // 用于排序
      this.$emit('on-checked', {
        level: this.level,
        key: item.key,
        name: item.value,
        check: val
      })
    },
    itemIndeterminate (child) {
      const hasChild = (meta) => {
        return meta.children.reduce((sum, item) => {
          let foundChilds = []
          if (item.check) sum.push(item)
          if (item.children) foundChilds = hasChild(item)
          return sum.concat(foundChilds)
        }, [])
      }
      const some = hasChild(child).length > 0
      const every = child.children && child.children.every(ret => ret.check)
      return some && !every
    }
  },
  watch: {
    data: {
      handler (nVal, oVal) {
        computeChild(nVal, this)
      },
      deep: true
    }
  },
  mounted () {
    computeChild(this.data, this)
  }
}
</script>
<style lang="stylus" scoped>
@import "~common/styles/mixin"

.c-cataract
  display block
  position absolute
  top 0
  left 0
  z-index 8
  cursor pointer
.c-check-all
  width 100%
  height 36px
  position relative
  z-index 9
  &:hover
    .c-check-item
      background-color #f8f8f8
  .c-item-select
    width 100%
    height 100%
.c-check-item
  margin 0
  padding 0 12px
  display block
  position relative
  height 36px
  line-height 36px
  &:hover
    background-color #f8f8f8
  &.active
    color #598fe6
    background-color #f8f8f8
    .c-check-arrow
      color #598fe6 !important
  .c-check-arrow
    float right
    margin-top 10px
  .c-item-checkbox
    width 36px
    height 36px
  .ivu-checkbox-wrapper
    >>>.ivu-checkbox
      margin-right 4px
.c-select-box
  overflow hidden
  border-width 0 !important
  >>>.ivu-checkbox-indeterminate
    .ivu-checkbox-inner
      background-color #6fb3fb
      border-color #6fb3fb
.c-check-item-disable
  cursor not-allowed
  .c-cataract
    cursor not-allowed
  >>>.ivu-checkbox-inner
    background-color #f3f3f3
</style>
