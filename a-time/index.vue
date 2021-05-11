<template>
  <div class="attr-check">
    <Row>
      <Col flex="110px">
        <span class="c-fix-title wt">{{ attr_name }}</span>
      </Col>
      <Col flex="90px" v-if="nolimit">
        <Button v-if="checked" type="primary" @click="noLimit">不限</Button>
        <Button v-else @click="noLimit">不限</Button>
      </Col>
      <!-- 充值情况 -->
      <Col flex="auto" v-if="atype === 'pay'">
        <Button type="primary" ghost @click="select_show = !select_show">{{
          btn_name[0]
        }}</Button>
        <Select v-model="dim" style="width: 140px" @on-open-change="dim_change">
          <Option v-for="item in attrBox.dimList" :value="item.value" :key="item.value">{{
            item.label
          }}</Option>
        </Select>
        <cCompare />
      </Col>
    </Row>
    <Divider />
  </div>
</template>
<script>
import cCompare from '@/components/c-compare'
import attrBox from '@/data/user/attr_box'
export default {
  name: 'attr-check',
  components: {
    cCompare
  },
  data () {
    return {
      attr_List: deepCopy(this.attrList),
      res_attr_List: [],
      sel_attr_List: [],
      checked: true,
      hasPhone: false,
      attrBox: attrBox,
      dim: 1
    }
  },
  props: {
    atype: {
      type: String,
      default () {
        return 'check'
      }
    },
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
    }
  },
  methods: {
    // 限制还是不限
    noLimit () {
      this.checked = !this.checked
      if (this.checked) {
        // 选中不限
        this.$Message.info('选择不限，默认选项也就失效了哦o(*￣▽￣*)ブ')
      } else {
        this.$Message.info('不做任何选择，默认不限哦o(*￣▽￣*)ブ')
      }
    },
    dim_change () {
      console.log(this.dim, '---dim')
    }
  },
  watch: {},
  created () {
  }
}
</script>
<style lang="stylus" scoped>
.ivu-row {
  margin-top: 8px;
}
.ivu-btn {
  margin-right: 10px
}
.ivu-select {
  margin-right: 10px
}
</style>
