export default {
  attrs: [
    {
      name: '设备特征',
      checked: false
    },
    {
      name: '游戏属性',
      checked: false
    },
    {
      name: '渠道属性',
      checked: false
    },
    {
      name: '平台属性',
      checked: false
    },
    {
      name: '用户行为',
      checked: false
    }
  ],
  sexList: [{
    id: 1,
    label: '男'
  }, {
    id: 2,
    label: '女'
  }],
  pfList: [{
    id: 1,
    label: '安卓'
  }, {
    id: 2,
    label: 'IOS'
  }],
  channelList: [{
    id: 1,
    label: '草花平台'
  }, {
    id: 2,
    label: '投放渠道'
  }],
  operatorList: [{
    id: 1,
    label: '联通'
  }, {
    id: 2,
    label: '移动'
  }, {
    id: 3,
    label: '电信'
  }, {
    id: 4,
    label: '其他'
  }],
  pfInfoList: [{
    label: '手机绑定',
    checked: false,
    id: 1
  }, {
    label: '客服联系',
    checked: false,
    id: 2
  }, {
    label: '召回动作',
    checked: false,
    id: 3
  }, {
    label: '召回成功',
    checked: false,
    id: 4
  }, {
    label: '公众号',
    checked: false,
    id: 5
  }, {
    label: '实名认证',
    checked: false,
    id: 6
  }],
  seedimList: [
    {
      value: 1,
      label: '注册'
    },
    {
      value: 2,
      label: '最近'
    },
    {
      value: 3,
      label: '选择'
    }
  ],
  dimList: [
    {
      value: 1,
      label: '累计充值金额'
    },
    {
      value: 2,
      label: '累计充值次数'
    }
  ],
  suf_active: [
    {
      value: 1,
      label: '天的活跃天数'
    }
  ],
  suf_login: [
    {
      value: 1,
      label: '天的登录次数'
    }
  ],
  suf_pay: [
    {
      value: 1,
      label: '天的充值次数'
    },
    {
      value: 2,
      label: '天的充值金额'
    }
  ],
  selsuf_active: [
    {
      value: 1,
      label: '累计总活跃天数'
    },
    {
      value: 2,
      label: '累计总活跃率'
    }
  ],
  selsuf_login: [
    {
      value: 1,
      label: '最近登录时间'
    }
  ],
  selsuf_pay: [
    {
      value: 1,
      label: '首次充值时间'
    },
    {
      value: 2,
      label: '某次充值时间'
    },
    {
      value: 3,
      label: '累计充值金额'
    },
    {
      value: 4,
      label: '累计充值次数'
    }
  ],
  judgeList: [
    {
      value: 1,
      label: '>'
    },
    {
      value: 2,
      label: '≥'
    },
    {
      value: 3,
      label: '='
    },
    {
      value: 4,
      label: '≤'
    },
    {
      value: 5,
      label: '<'
    },
    {
      value: 6,
      label: '≠'
    },
    {
      value: 7,
      label: '范围'
    }
  ],
  init_form: [
    {
      index: 1,
      status: 1,
      seedim: 1,
      seedim_label: '注册',
      scompare: 1,
      scompare_label: '>',
      sNum: 3,
      seerange: {
        min: null,
        max: null
      },
      seerange_content: '',
      suffix: '',
      suffix_label: '',
      selsuf_type: 'num',
      selsuf: '',
      selsuf_label: '',
      datetime: ['', ''],
      comDate: ['', ''],
      compare: 1,
      compare_label: '>',
      cNum: 3,
      comrange: {
        min: null,
        max: null
      },
      comrange_content: '',
      tip_show: false,
      msg: ''
    }
  ]
}
