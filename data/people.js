export default {
  rule_name: '我的人群',
  description: '消费高的人群',
  condition: {
    dev_feature: {
      p_pf: {
        val: ['安卓', 'IOS'],
        nolimit: false
      },
      operator: {
        val: ['联通', '移动'],
        nolimit: false
      }
    },
    game_attr: {
      play_game: {
        val: ['130100', '130200', '130300'],
        selectKeys: ['13-130100', '13-130200', '13-130300'],
        nolimit: false
      }
    },
    channel_attr: {
      channel_attr: {
        val: ['草花平台'],
        nolimit: false
      },
      channel: {
        val: ['14-140100', '14-140400', '12'],
        val2: [],
        selectKeys: ['14-140100', '14-140400', '12'],
        nolimit: false
      }
    },
    pfinfo_attr: {
      pf_info: {
        val: ['手机绑定', '客服联系'],
        nolimit: false
      },
      vip_level: {
        judge: 1,
        judgeNum: 2,
        nolimit: false
      },
      vip_service: {
        service: [1],
        nolimit: false
      },
      pay_info: {
        gameIds: ['140100'],
        selectKeys: ['14-140100'],
        dim: 1,
        judge: 7,
        judgeRange: {
          min: '2',
          max: '4'
        },
        nolimit: false
      },
      p_birth: {
        beginTime: '2021-01-02',
        endTime: '2021-01-05'
      },
      ch_bean: {
        min: '0',
        max: '不限'
      },
      ch_coin: {
        min: '1',
        max: '4'
      }
    },
    user_behavior: {
      active_state: [{
        seedim: 1,
        scompare: 1,
        sNum: 3,
        suffix: 1,
        compare: 1,
        cNum: 3
      }, {
        seedim: 1,
        scompare: 1,
        sNum: 3,
        suffix: 1,
        compare: 1,
        cNum: 3
      }],
      login_state: [{
        seedim: 3,
        selsuf: 1,
        compare: 7,
        comrange: {
          min: '不限',
          max: '不限'
        }
      }],
      recharge_state: [{
        seedim: 1,
        scompare: 7,
        seerange: {
          min: '2',
          max: '4'
        },
        suffix: 1,
        compare: 1,
        cNum: 3
      }]
    }
  },
  preview: [{
    attr_name: '预计人群:',
    attr_key: 'pre_num',
    attr_content: 'XXXXXX人'
  }, {
    attr_name: '受众信息',
    attr_key: 'p_info',
    attr_content: ''
  }, {
    attr_name: '性别:',
    attr_key: 'p_sex',
    attr_content: '不限'
  }, {
    attr_name: '年龄:',
    attr_key: 'p_age',
    attr_content: '16-25,30-35,55-60以上'
  }, {
    attr_name: '地域:',
    attr_key: 'p_area',
    attr_content: '不限'
  }, {
    attr_name: '平台:',
    attr_key: 'p_pf',
    attr_content: '不限'
  }, {
    attr_name: '运营商:',
    attr_key: 'operator',
    attr_content: '不限'
  }, {
    attr_name: '玩过的游戏:',
    attr_key: 'play_game',
    attr_content: '不限'
  }, {
    attr_name: '渠道属性:',
    attr_key: 'channel_attr',
    attr_content: '不限'
  }, {
    attr_name: '渠道:',
    attr_key: 'channel',
    attr_content: '不限'
  }, {
    attr_name: '平台信息:',
    attr_key: 'pf_info',
    attr_content: '不限'
  }, {
    attr_name: 'VIP等级:',
    attr_key: 'vip_level',
    attr_content: '不限'
  }, {
    attr_name: 'VIP客服:',
    attr_key: 'vip_service',
    attr_content: '不限'
  }, {
    attr_name: '充值情况:',
    attr_key: 'pay_info',
    attr_content: '不限'
  }, {
    attr_name: '生日:',
    attr_key: 'p_birth',
    attr_content: '12/01 - 12/02'
  }, {
    attr_name: '草花豆:',
    attr_key: 'ch_bean',
    attr_content: '[10000,不限)'
  }, {
    attr_name: '草花币:',
    attr_key: 'ch_coin',
    attr_content: '[0,1000)'
  }, {
    attr_name: '活跃:',
    attr_key: 'active_state',
    attr_content: '注册7天活跃天数超5天'
  }, {
    attr_name: '登录:',
    attr_key: 'login_state',
    attr_content: '注册7天活跃天数超5天'
  }, {
    attr_name: '充值:',
    attr_key: 'recharge_state',
    attr_content: '注册7天活跃天数超5天'
  }]
}
