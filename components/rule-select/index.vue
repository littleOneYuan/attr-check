<template>
  <div class="rule-select">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <Layout>
      <Layout>
        <Content>
          <Row class="title-row" :gutter="3">
            <Col flex="60px">
              <span class="c-attr wt back" @click="cancel"
                ><Icon type="md-arrow-round-back"
              /></span>
            </Col>
            <Col span="10">
              <Input
                v-if="name_input"
                v-model="rule_name"
                :border="false"
                placeholder="请输入人群名称...(双击修改)"
                @on-blur="name_handle('confirm')"
                style="width: 300px"
              />
              <span v-else class="name wt" @dblclick="name_handle('change')">{{
                rule_name
              }}</span>
            </Col>
          </Row>
          <Row class="des-row" :gutter="1">
            <Col flex="60px">
              <span class="c-attr wt">描述</span>
            </Col>
            <Col span="10">
              <Input
                v-model="description"
                :border="false"
                placeholder="请输入描述内容..."
                style="width: 300px"
              />
            </Col>
          </Row>
          <Row>
            <Col flex="120px">
              <span class="c-attr wt">行为属性</span>
            </Col>
            <Col flex="auto" class="btn-group">
              <cBtn
                name="用户行为"
                :check_state="attrs[4].checked"
                @click="attr_handle"
              />
            </Col>
          </Row>
          <Row>
            <Col flex="120px">
              <span class="c-attr wt">基础属性</span>
            </Col>
            <Col flex="auto" class="btn-group">
              <cBtn
                name="设备特征"
                :check_state="attrs[0].checked"
                @click="attr_handle"
              />
              <cBtn
                name="游戏属性"
                :check_state="attrs[1].checked"
                @click="attr_handle"
              />
              <cBtn
                name="渠道属性"
                :check_state="attrs[2].checked"
                @click="attr_handle"
              />
              <cBtn
                name="平台属性"
                :check_state="attrs[3].checked"
                @click="attr_handle"
              />
            </Col>
          </Row>
          <div class="detail-attr" :style="da_style">
            <p class="tip-text">详细属性选择</p>
            <div v-show="cur_attr === '人群特征'">
              <span class="c-fix-title wt">当前正在筛选：人群特征</span>
              <Divider />
              <!-- <attrCheck attr_name="性别" atype="check" :attrList="attrList.sexList" /> -->
              <!-- <attrCheck
                attr_name="地域"
                atype="select"
                :btn_name="['省市']"
                :attrList="cityData"
              /> -->
            </div>
            <div v-show="cur_attr === '设备特征'">
              <span class="c-fix-title wt">当前正在筛选：设备特征</span>
              <Divider />
              <aCheck
                attr_name="平台"
                :attrList="attrList.pfList"
                :initList="init_pfList"
                @getData="check_get"
              />
              <aCheck
                attr_name="运营商"
                :attrList="attrList.operatorList"
                :initList="init_operatorList"
                @getData="check_get"
              />
            </div>
            <div v-show="cur_attr === '游戏属性'">
              <span class="c-fix-title wt">当前正在筛选：游戏属性</span>
              <Divider />
              <aSelect
                attr_name="玩过的游戏"
                btn_name="游戏组"
                :selList="init_play_game"
                :attrList="gameData"
                @getData="select_get"
              ></aSelect>
            </div>
            <div v-show="cur_attr === '渠道属性'">
              <span class="c-fix-title wt">当前正在筛选：渠道属性</span>
              <Divider />
              <aCheck
                attr_name="渠道属性"
                :attrList="attrList.channelList"
                :initList="init_channelList"
                @getData="check_get"
              />
              <aSelect
                attr_name="渠道"
                btn_name="渠道"
                :selList="init_channel"
                :attrList="channelData"
                @getData="select_get"
              ></aSelect>
            </div>
            <div v-show="cur_attr === '平台属性'">
              <span class="c-fix-title wt">当前正在筛选：平台属性</span>
              <Divider />
              <aSwitch
                attr_name="平台信息"
                :attrList="attrList.pfInfoList"
                :initList="init_pfInfoList"
                @getData="switchs_get"
              />
              <aCompare
                attr_name="VIP等级"
                :initData="init_vip_level"
                @getData="level_get"
              />
              <aSimSelect
                attr_name="VIP客服"
                btn_name="VIP客服"
                :attrList="vipServiceList"
                :init_selList="init_vip_service"
                @getData="sim_select_get"
              />
              <aPay
                attr_name="充值情况"
                btn_name="游戏组"
                :initData="init_pay_info"
                :attrList="gameData"
                @getData="pay_get"
              ></aPay>
              <aTime attr_name="生日" :initDate="init_pBirth" @getData="time_get" />
              <aNtn attr_name="草花豆" :initNum="init_ch_bean" @getData="ntn_get" />
              <aNtn attr_name="草花币" :initNum="init_ch_coin" @getData="ntn_get" />
            </div>
            <div v-show="cur_attr === '用户行为'">
              <span class="c-fix-title wt">当前正在筛选：用户行为</span>
              <Divider />
              <addCondition
                attr_name="活跃"
                :initData="init_active_state"
                :isCreate="active_create"
                @getData="addC_get"
              />
              <addCondition
                attr_name="登录"
                :initData="init_login_state"
                :isCreate="login_create"
                @getData="addC_get"
              />
              <addCondition
                attr_name="充值"
                :initData="init_recharge_state"
                :isCreate="recharge_create"
                @getData="addC_get"
              />
            </div>
          </div>
        </Content>
        <Footer align="right">
          <Button @click="cancel">取 消</Button>
          <Button type="primary" ghost @click="preview">画像预览</Button>
          <Button type="primary" @click="computePeople">预计人数</Button>
          <Button type="success" @click="production">生 产</Button>
        </Footer>
      </Layout>
      <Sider hide-trigger :width="side_width">
        <div class="eye-btn" @click="side_handle">
          <Icon v-if="side_eye" type="md-eye" />
          <Icon v-else type="md-eye-off" />
        </div>
        <div class="sider-content">
          <Row v-for="attr in previewAttr" :key="attr.attr_key">
            <Col>
              <span v-if="attr.attr_key === 'p_info'" class="attr-span wt"
                >----------- {{ attr.attr_name }} -----------</span
              >
              <span v-else class="attr-span wt">{{ attr.attr_name }}</span>
              <span class="content-span">{{ attr.attr_content }}</span>
            </Col>
          </Row>
        </div>
      </Sider>
    </Layout>
  </div>
</template>
<script>
import {
  getStaffs,
  initEditUserGroup,
  addOrUpdateUserGroup,
  getUserGroupPreview,
  getChannelAndSource,
  getGameGroupAndGameInfo
} from '@/api/common.model'
import attrBox from '@/data/user/attr_box'
import peopleObj from '@/data/user/peopleObj'
import preview_attr from '@/data/user/preview_attr'
// import attrCheck from '@/components/attr-check'
import aNtn from '@/components/attr-check/a-ntn'
import aPay from '@/components/attr-check/a-pay'
import aTime from '@/components/attr-check/a-time'
import aCheck from '@/components/attr-check/a-check'
import aSelect from '@/components/attr-check/a-select'
import aCompare from '@/components/attr-check/a-compare'
import aSimSelect from '@/components/attr-check/a-sim-select'
import aSwitch from '@/components/attr-check/a-switch'
import cBtn from '@/components/c-btn'
import addCondition from '@/components/addCondition'
import cityData from '@/data/toutiao/city_province'
// import people from '@/data/user/people'
import { isArray, unique, deepCopy, init_range_handle } from '@/common/js/c_common'
export default {
  name: 'rule-select',
  props: {
    rule_motion: {
      type: String,
      default () {
        return 'create'
      }
    },
    groupId: {
      type: Number,
      default () {
        return null
      }
    }
  },
  data () {
    const { init_form } = attrBox
    return {
      gameData: [],
      spinShow: false,
      channelData: [],
      init_pfList: [],
      init_pfInfoList: [],
      init_operatorList: [],
      init_channelList: [],
      init_channel: [],
      init_play_game: [],
      init_vip_service: [],
      init_pBirth: ['', ''],
      init_active_state: deepCopy(init_form),
      init_login_state: deepCopy(init_form),
      init_recharge_state: deepCopy(init_form),
      init_vip_level: {
        judge: null,
        judgeNum: null,
        judgeRange: {
          minNum: '',
          maxNum: ''
        }
      },
      init_pay_info: {
        selList: [],
        dim: null,
        judge: null,
        judgeNum: null,
        judgeRange: {
          minNum: '',
          maxNum: ''
        }
      },
      init_ch_bean: {
        minNum: '',
        maxNum: ''
      },
      init_ch_coin: {
        minNum: '',
        maxNum: ''
      },
      attrs: attrBox.attrs,
      groupObj: deepCopy(peopleObj),
      cur_attr: '',
      name_input: true,
      side_width: 240,
      side_eye: false,
      rule_name: '',
      description: '',
      base_attr: [''],
      screenHeight: window.innerHeight,
      bhv_attr: [''],
      attrList: attrBox,
      previewAttr: deepCopy(preview_attr),
      cityData: cityData,
      motion: 0,
      active_create: true,
      login_create: true,
      recharge_create: true,
      sim_select: [
        {
          value: 1,
          label: '选项一'
        },
        {
          value: 2,
          label: '选项二'
        }
      ],
      vipServiceList: []
    }
  },
  components: {
    cBtn,
    aPay,
    aNtn,
    aTime,
    aSelect,
    aCheck,
    aSwitch,
    aCompare,
    // attrCheck,
    aSimSelect,
    addCondition
  },
  computed: {
    da_style () {
      return {
        height: `${this.screenHeight - 358}px`
      }
    }
  },
  methods: {
    check_get (checks, attr_name) {
      if (checks && isArray(checks)) {
        var content
        var nolimit = false
        if (checks.length === 0) {
          content = '不限'
          nolimit = true
        } else {
          content = checks.join(',')
        }
        this.previewAttr.some((item) => {
          if (item.attr_name === attr_name + ':') {
            item.attr_content = content
          }
        })
        var obj = {
          val: checks,
          nolimit: nolimit
        }
        switch (attr_name) {
          case '平台':
            this.groupObj.dev_feature.p_pf = obj || {}
            break
          case '运营商':
            this.groupObj.dev_feature.operator = obj || {}
            break
          case '渠道属性':
            this.groupObj.channel_attr.channel_attr = obj || {}
            break
        }
      }
    },
    switchs_get (switchs) {
      if (switchs && isArray(switchs)) {
        var content
        var nolimit = false
        if (switchs.length === 0) {
          content = '不限'
          nolimit = true
        } else {
          const s = switchs.map((item) => '有' + item)
          content = s.join(',')
        }
        this.previewAttr.some((item) => {
          if (item.attr_key === 'pf_info') {
            item.attr_content = content
          }
        })
        var obj = {
          val: switchs,
          nolimit: nolimit
        }
        this.groupObj.pfinfo_attr.pf_info = obj
      }
    },
    select_get (ids, keys, labels, attr_name) {
      if (labels && isArray(labels)) {
        var content
        var nolimit = false
        var val = []
        var val2 = []
        var selectKeys = []
        if (isArray(labels) && labels.length === 0) {
          content = '不限'
          nolimit = true
        } else {
          content = labels.join(',')
          val2 = ids
          selectKeys = keys
          let temp_keys = keys.map((item) => (item = item.split('-')[0]))
          temp_keys = unique(temp_keys)
          val = temp_keys
        }
        this.previewAttr.some((item) => {
          if (item.attr_name === attr_name + ':') {
            item.attr_content = content
          }
        })
        var obj = {
          val: val,
          val2: val2,
          selectKeys: selectKeys,
          nolimit: nolimit
        }
        switch (attr_name) {
          case '玩过的游戏':
            obj.val = val2
            delete obj.val2
            this.groupObj.game_attr.play_game = obj
            break
          case '渠道':
            this.groupObj.channel_attr.channel = obj
            break
        }
      }
    },
    ntn_get (data, attr_name, range) {
      var content
      var obj = {
        min: '不限',
        max: '不限'
      }
      if (data === '' || data === '不限') {
        content = '不限'
      } else {
        content = data
        obj = range
      }
      this.previewAttr.some((item) => {
        if (item.attr_name === attr_name + ':') {
          item.attr_content = content
        }
      })
      switch (attr_name) {
        case '草花豆':
          this.groupObj.pfinfo_attr.ch_bean = obj
          break
        case '草花币':
          this.groupObj.pfinfo_attr.ch_coin = obj
          break
      }
    },
    time_get (date, attr_name) {
      var content
      var obj = {
        beginTime: '',
        endTime: ''
      }
      if (date[0] === '' && date[1] === '') {
        content = '不限'
      } else {
        content = date[0] + '至' + date[1]
        obj = {
          beginTime: date[0],
          endTime: date[1]
        }
      }
      this.previewAttr.some((item) => {
        if (item.attr_name === attr_name + ':') {
          item.attr_content = content
        }
      })
      switch (attr_name) {
        case '生日':
          this.groupObj.pfinfo_attr.p_birth = obj
          break
      }
    },
    sim_select_get (ids, labels, attr_name) {
      console.log(labels, 'sim_select_get')
      if (labels && isArray(labels)) {
        var content
        var nolimit = false
        if (labels.length === 0) {
          content = '不限'
          nolimit = true
        } else {
          content = labels.join(',')
        }
        this.previewAttr.some((item) => {
          if (item.attr_name === attr_name + ':') {
            item.attr_content = content
          }
        })
        var obj = {
          service: ids,
          nolimit: nolimit
        }
        switch (attr_name) {
          case 'VIP客服':
            this.groupObj.pfinfo_attr.vip_service = obj
            break
        }
      }
    },
    level_get (resObj, attr_name) {
      var content
      var obj
      if (resObj === '不限' || resObj.content === 'null' || resObj.content === '') {
        content = '不限'
        obj = {
          nolimit: true
        }
      } else {
        content = resObj.content
        obj = resObj.val
      }
      this.previewAttr.some((item) => {
        if (item.attr_name === attr_name + ':') {
          item.attr_content = content
        }
      })
      switch (attr_name) {
        case 'VIP等级':
          this.groupObj.pfinfo_attr.vip_level = obj
          break
      }
    },
    pay_get (resObj, attr_name) {
      console.log(resObj.content)
      var content
      var obj
      if (resObj === '不限' || resObj.content === 'null' || resObj.content === '') {
        content = '不限'
        obj = {
          nolimit: true
        }
      } else {
        content = resObj.content
        obj = resObj.val
      }
      this.previewAttr.some((item) => {
        if (item.attr_name === attr_name + ':') {
          item.attr_content = content
        }
      })
      switch (attr_name) {
        case '充值情况':
          this.groupObj.pfinfo_attr.pay_info = obj
          break
      }
    },
    addC_get (resObjArr, attr_name) {
      console.log(resObjArr, '---resObjArr')
      var content
      var obj
      if (resObjArr === '不限') {
        content = '不限'
        obj = {
          nolimit: true
        }
      } else {
        const arr_c = []
        const arr_v = []
        resObjArr.forEach((item) => {
          arr_c.push(item.content)
          arr_v.push(item.val)
        })
        content = arr_c.join(',')
        obj = arr_v
      }
      this.previewAttr.some((item) => {
        if (item.attr_name === attr_name + ':') {
          item.attr_content = content
        }
      })
      switch (attr_name) {
        case '活跃':
          this.groupObj.user_behavior.active_state = obj
          break
        case '登录':
          this.groupObj.user_behavior.login_state = obj
          break
        case '充值':
          this.groupObj.user_behavior.recharge_state = obj
          break
      }
    },
    // 取消
    cancel () {
      this.$emit('showfun', {
        status: false,
        msg: ''
      })
    },
    // 画像预览
    preview () {},
    // 预计人数
    computePeople () {
      getUserGroupPreview(this.groupObj).then((data) => {
        this.$Message.success(`BI已为您预估当前条件生产的人群数是：${data} 人 (*^▽^*)`)

        this.previewAttr.some((item) => {
          if (item.attr_key === 'pre_num') {
            item.attr_content = `${data} 人`
          }
        })
      })
    },
    // 生产
    production () {
      console.log(this.groupObj, '---groupObj')
      var req = {
        rule_name: this.rule_name,
        description: this.description,
        condition: this.groupObj
      }
      addOrUpdateUserGroup(req).then((data) => {
        if (data.msg === '成功！') {
          this.$emit('showfun', {
            status: false,
            msg: '您的人群已创建成功(๑•̀ㅂ•́)و✧'
          })
        } else {
          this.$Message.error('人群创建失败o(╥﹏╥)o')
        }
      })
    },
    name_handle (motion) {
      if (motion === 'confirm') {
        if (!this.rule_name) this.rule_name = '默认人群名称'
        this.name_input = false
      } else if (motion === 'change') {
        this.name_input = true
      }
    },
    // 属性处理
    attr_handle (checked, attr_name) {
      this.attrs.forEach((a) => {
        if (a.name !== attr_name && a.checked && checked) {
          a.checked = false
        } else if (a.name === attr_name) {
          a.checked = checked
        }
      })
      if (checked) this.cur_attr = attr_name
    },
    // 侧边栏收缩
    side_handle () {
      this.side_width = this.side_eye ? 240 : 0
      this.side_eye = !this.side_eye
    },
    // 初始化赋初值
    initEditUserGroup () {
      initEditUserGroup({
        group_id: this.groupId
      }).then((data) => {
        console.log(data)
        this.active_create = false
        this.login_create = false
        this.recharge_create = false
        const { rule_name, description, condition } = deepCopy(data)
        const {
          dev_feature,
          game_attr,
          channel_attr,
          pfinfo_attr,
          user_behavior
        } = deepCopy(condition)
        this.rule_name = rule_name || ''
        this.name_input = false
        this.description = description || ''
        // 设备特征
        this.init_pfList = dev_feature.p_pf.nolimit
          ? this.init_pfList
          : dev_feature.p_pf.val
        console.log(this.init_pfList, '--this.init_pfList')
        this.init_operatorList = dev_feature.operator.nolimit
          ? this.init_operatorList
          : dev_feature.operator.val
        // 游戏属性
        this.init_play_game = game_attr.play_game.nolimit
          ? this.init_play_game
          : game_attr.play_game.selectKeys
        // 渠道属性
        this.init_channelList = channel_attr.channel_attr.nolimit
          ? this.init_channelList
          : channel_attr.channel_attr.val
        this.init_channel = channel_attr.channel.nolimit
          ? this.init_channel
          : channel_attr.channel.selectKeys
        // 平台属性
        this.init_pfInfoList = pfinfo_attr.pf_info.nolimit
          ? this.init_pfInfoList
          : pfinfo_attr.pf_info.val
        this.init_vip_level = pfinfo_attr.vip_level.nolimit
          ? this.init_vip_level
          : {
            judge: pfinfo_attr.vip_level.judge,
            judgeNum:
                pfinfo_attr.vip_level.judge !== 7 ? pfinfo_attr.vip_level.judgeNum : null,
            judgeRange:
                pfinfo_attr.vip_level.judge === 7
                  ? {
                    minNum: pfinfo_attr.vip_level.judgeRange.min,
                    maxNum: pfinfo_attr.vip_level.judgeRange.max
                  }
                  : {
                    minNum: '',
                    maxNum: ''
                  }
          }
        this.init_vip_service = pfinfo_attr.vip_service.nolimit
          ? this.init_vip_service
          : pfinfo_attr.vip_service.service
        this.init_pay_info = pfinfo_attr.pay_info.nolimit
          ? this.init_pay_info
          : {
            selList: pfinfo_attr.pay_info.selectKeys,
            dim: pfinfo_attr.pay_info.dim,
            judge: pfinfo_attr.pay_info.judge,
            judgeNum:
                pfinfo_attr.pay_info.judge !== 7 ? pfinfo_attr.pay_info.judgeNum : null,
            judgeRange:
                pfinfo_attr.pay_info.judge === 7
                  ? {
                    minNum: pfinfo_attr.pay_info.judgeRange.min,
                    maxNum: pfinfo_attr.pay_info.judgeRange.max
                  }
                  : {
                    minNum: '',
                    maxNum: ''
                  }
          }
        this.init_pBirth = pfinfo_attr.p_birth
          ? [pfinfo_attr.p_birth.beginTime, pfinfo_attr.p_birth.endTime]
          : this.init_pBirth
        this.init_ch_bean = pfinfo_attr.ch_bean
          ? {
            minNum: pfinfo_attr.ch_bean.min === '不限' ? '' : pfinfo_attr.ch_bean.min,
            maxNum: pfinfo_attr.ch_bean.max === '不限' ? '' : pfinfo_attr.ch_bean.max
          }
          : this.init_ch_bean
        this.init_ch_coin = pfinfo_attr.ch_coin
          ? {
            minNum: pfinfo_attr.ch_coin.min === '不限' ? '' : pfinfo_attr.ch_coin.min,
            maxNum: pfinfo_attr.ch_coin.max === '不限' ? '' : pfinfo_attr.ch_coin.max
          }
          : this.init_ch_coin
        // 用户行为
        this.init_active_state = user_behavior.active_state
          ? this.addCData_handle(user_behavior.active_state)
          : this.init_active_state
        this.init_login_state = user_behavior.login_state
          ? this.addCData_handle(user_behavior.login_state)
          : this.init_login_state
        this.init_recharge_state = user_behavior.recharge_state
          ? this.addCData_handle(user_behavior.recharge_state)
          : this.init_recharge_state
        // */
      })
      // /**
      // console.log(people, '---people')
    },
    // 处理用户行为
    addCData_handle (o_arr) {
      var res_arr = deepCopy(o_arr)
      var index = 1
      if (isArray(o_arr) && o_arr.length > 0) {
        res_arr = []
        o_arr.forEach((o) => {
          var s_obj = deepCopy(attrBox.init_form[0])
          s_obj.index = index
          Object.keys(o).forEach((key) => {
            if (o[`${key}`]) {
              s_obj[`${key}`] = o[`${key}`]
            }
          })
          // 范围处理
          s_obj.seerange = init_range_handle(s_obj.seerange)
          s_obj.comrange = init_range_handle(s_obj.comrange)
          res_arr.push(s_obj)
          index++
        })
      }
      console.log(res_arr, '---res_arr')
      return res_arr
    },
    getChannelAndSource () {
      getChannelAndSource().then((data) => {
        if (data && isArray(data)) {
          this.channelData = data
        }
      })
    },
    getGameGroupAndGameInfo () {
      getGameGroupAndGameInfo().then((data) => {
        if (data && isArray(data)) {
          this.gameData = data
        }
      })
    },
    getStaffs () {
      getStaffs().then((data) => {
        if (data && isArray(data)) {
          console.log(data, '---getStaffs')
          this.vipServiceList = this.selectedList_handle(data)
        }
      })
    },
    // 处理选项数组
    selectedList_handle (list) {
      if (isArray(list) && list.length > 0) {
        var res_list = []
        list.forEach((item) => {
          var k_arr = Object.keys(item)
          var o = {}
          o.value = item[k_arr[0]]
          o.label = item[k_arr[1]]
          res_list.push(o)
        })
        return res_list
      }
    }
  },
  watch: {
    rule_motion (n, o) {
      if (n === 'copy') {
        this.spinShow = true
        this.initEditUserGroup()
        setTimeout(() => {
          this.spinShow = false
          this.attrs[0].checked = true
          this.attr_handle(true, '设备特征')
        }, 3000)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.screenHeight = window.innerHeight
    })
    window.onresize = () => {
      return (() => {
        window.screenHeight = window.innerHeight
        this.screenHeight = window.screenHeight
      })()
    }
  },
  created () {
    this.getStaffs()
    this.getGameGroupAndGameInfo()
    this.getChannelAndSource()
    if (this.rule_motion === 'copy') {
      this.spinShow = true
      this.initEditUserGroup()
      setTimeout(() => {
        this.spinShow = false
        this.attr_handle(true, '设备特征')
      }, 3000)
    }
  }
}
</script>
<style lang="stylus" scoped>
.rule-select {
  width: 100%
  height: 100%
  .ivu-layout {
    width: 100%
    height: 100%
  }
}
.ivu-btn {
  margin-left: 12px
  width: 100px
}
// 人群名称
.name {
  color: #7facd8
  font-size: 20px
  letter-spacing: 3px
}
// 返回
span.back {
  font-size: 32px
  height: 32px
  color: #7facd8
  &:hover {
    color: #fff
  }
}
.des-row {
  font-size: 16px
}
.ivu-row {
  margin-top: 6px;
  &:first-child {
    margin-top: 0px;
  }
}
.ivu-checkbox-group {
  display: flex;
  justify-content: space-between;
}
.ivu-layout-footer {
  // padding-right: 10px
  padding: 20px 10px
}
.ivu-layout-content {
  padding: 8px 12px
  /deep/ .ivu-col {
    line-height: 32px;
  }
}
.ivu-layout-sider {
  .sider-content {
    overflow-y: auto
    height: 100%
    padding: 10px 12px
  }
  .ivu-col {
    margin-top: 4px
    transition: padding .3s
  }
  .ivu-col:hover {
    border-left: 4px solid #85c3fd
    padding-left: 10px
    cursor: pointer
  }
  span {
    transition: all 0.2s cubic-bezier(0.7, 0, 0.3, 1);
    font-size: 14px
    color: #cfd8e0;
    letter-spacing: 1px;
  }
  span.attr-span {
    margin-right: 4px
    color: #91b6d8
  }
}
// 侧边栏
.eye-btn {
  width: 36px
  height: 40px
  cursor: pointer
  line-height: 38px
  color: #fff
  font-size: 20px
  text-align: center
  border-radius: 10px 0px 0px 10px
    background: #7da3c7
  position: absolute
  left: -36px
  top: 20px
  transition: .5s
  &:hover {
    font-size: 22px
  background: #757e92
  }
}
// 基础属性组
.btn-group {
  display: flex
  justify-content: space-between
}
// 详细属性选择
p.tip-text {
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  letter-spacing: 10px
  z-index: 0
  color: #7a8190
  font-size: 70px
  font-weight: 600
  font-style: italic
}
.detail-attr {
  position: relative
  background-color: #6d7484;
  width: 100%;
  overflow-y: auto
  margin-top: 10px;
  border-radius: 8px;
  border: 1px solid #bad1e6;
  box-shadow: 0px 0px 4px 0px #436586;
  &>div {
    width: 100%
    min-height: 100%
    background-color: #fff;
    padding: 14px 16px 8px;
    z-index: 1
    position: absolute
    top: 0
  }
}
.c-fix-title {
  font-size: 16px
  height: 32px
  line-height: 32px
  color: #7da3c7
}
.c-fix-title:before {
  background: #eff7ff;
}
.ivu-btn-success {
    color: #fff;
    background-color: #5f9ce0;
    border-color: #5f9ce0;
}
</style>
