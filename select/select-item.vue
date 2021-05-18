<template>
  <div class="c-select-item" :class="classes">
    <div class="c-header">
      <span class="c-header-title">{{title}}</span>
      <span class="c-header-clear" v-if="clear" @click="$emit('on-clear')">清空全部</span>
    </div>
    <div class="c-search" :class="{'m-disabled': disabled}" v-if="search && !clear">
      <Input
        v-model="keyword"
        placeholder="请输入关键字搜索"
        clearable
        search
        :disabled="disabled" />
    </div>
    <div class="c-selecter-content" :style="clearStyle">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'selectItem',
  props: {
    value: {
      type: [String, Number],
      default () {
        return ''
      }
    },
    title: {
      type: String
    },
    clear: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    search: {
      type: Boolean
    }
  },
  computed: {
    keyword: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    classes () {
      return this.clear ? 'item-border' : ''
    },
    clearStyle () {
      return this.clear && this.search ? {height: `${48 + 246}px`} : ''
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "~common/styles/mixin"

.c-nodata
  width 100%
  height 100%
  display flex
  justify-content center
  align-items center
  .ivu-icon
    display inline-block
.c-select-item
  background-color #fff
  &.item-border
    border solid 1px #dee4f5
  .c-header
    padding 0 12px
    height 34px
    font-size 14px
    color #333
    border-bottom solid 1px #dee4f5
    background-color #fafbfe
    .c-header-title, .c-header-clear
      height 34px
      line-height 34px
      vertical-align middle
    .c-header-clear
      color #598fe6
      float right
      cursor pointer
  .c-selecter-content
    $scroll()
    height 246px
    width 100%
    padding-bottom 8px
  .c-search
    width 100%
    padding 8px 10px
    background-color #fff
    font-size 12px
    >>>.el-input
      font-size 12px
    >>>.el-input__icon, >>>.el-input__inner
      height 30px
      line-height 30px
    >>>.el-input__inner
      padding-left 7px
      border-bottom-right-radius 0
      border-top-right-radius 0
    >>>.el-button--primary
      color #FFF
      background-color #409EFF
      border-color #409EFF
      border-bottom-left-radius 0
      border-top-left-radius 0
      padding 8px 12px
      i
        font-size 12px
        display inline
  .m-disabled
    >>>.el-button--primary
      background-color #a0cfff
      border-color #a0cfff
</style>
