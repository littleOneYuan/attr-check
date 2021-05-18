export const cBlue = '#7da3c7'
export const cPink = '#f79c9c'
export const base_http = 'https://bi.caohua.com/api/exportYYReportListByGroup?'
export const plat_base_http = 'https://bi.caohua.com/api/exportDailyDatas?'
export const and_base_http =
  'https://bi.caohua.com/api/exportAndroidYyDayReport?'
export const ios_base_http = 'https://bi.caohua.com/api/exportIOSYyDayReport?'
export const old_base_http = 'https://bi.caohua.com/api/exportOldYyDayReport?'
export const ltv_base_http = 'https://bi.caohua.com/api/exportLtvDatas'
/**
 * @param {Array} mon_arr 月份标准时间数组
 * @description 用于将获取的中国标准时间转换成yyyy-mm-dd的格式
 */
export const month_handle = mon_arr => {
  if (mon_arr) {
    var res_arr = []
    mon_arr.forEach(item => {
      var d = new Date(item)
      var datetime = ''
      if (d.getMonth() < 9) {
        datetime = d.getFullYear() + '-0' + (d.getMonth() + 1) + '-01'
        // d.getFullYear() + '-0' + (d.getMonth() + 1) + '-0' + d.getDate()
      } else {
        datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-01'
        // d.getFullYear() + '-' + (d.getMonth() + 1) + '-0' + d.getDate()
      }
      res_arr.push(datetime)
    })
  }
  return res_arr
}

/**
 * 深度拷贝
 * @param {any} data
 */
export function deepCopy (data) {
  const t = isArray(data) ? 'array' : typeof data
  let o

  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]))
    }
  } else if (t === 'object') {
    for (const i in data) {
      o[i] = deepCopy(data[i])
    }
  }
  return o
}

/**
 * @param {Array} init_range 需要处理的初始数据
 * @description nToN组件初始数据处理
 */
export function init_range_handle (init_range) {
  if (!init_range.minNum) { // min/max
    const res_range = {
      minNum: '',
      maxNum: ''
    }
    const { min, max } = init_range
    if (min === '不限' && max === '不限') {
      res_range.minNum = ''
      res_range.maxNum = ''
    } else if (min !== '不限' && max === '不限') {
      res_range.minNum = min
      res_range.maxNum = ''
    } else {
      res_range.minNum = min || ''
      res_range.maxNum = max || ''
    }
    return res_range
  }
  return init_range
}

/**
 * @param {Array} init_range 需要处理的初始数据
 * @description c-ntn组件初始数据处理
 */
export function c_init_range_handle (init_range) {
  const res_range = {
    min: null,
    max: null
  }
  const { min, max } = init_range
  if (min === '不限' && max === '不限') {
    res_range.min = null
    res_range.max = null
  } else if (min !== '不限' && max === '不限') {
    res_range.min = Number(min)
    res_range.max = null
  } else {
    res_range.min = min === 0 || min ? Number(min) : null
    res_range.max = max === 0 || max ? Number(max) : null
  }
  return res_range
}

/**
 * @param {Array} init_range 需要处理的数据
 * @description 待提交数据处理
 */
export function commit_range_handle (init_range) {
  if (!init_range.min) { // minNum/maxNum
    const res_range = {
      min: '',
      max: ''
    }
    const { minNum, maxNum } = init_range
    if (minNum === '' && maxNum === '') {
      res_range.min = '不限'
      res_range.max = '不限'
    } else if (minNum !== '' && maxNum === '') {
      res_range.min = minNum
      res_range.max = '不限'
    } else if (minNum === '' && maxNum !== '') {
      res_range.min = 0
      res_range.max = 'maxNum'
    } else {
      res_range.min = minNum || ''
      res_range.max = maxNum || ''
    }
    return res_range
  }
  return init_range
}

/**
 * @param {Array} init_range 需要处理的数据
 * @description addcondition中c-ntn待提交数据处理
 */
export function c_commit_range_handle (init_range) {
  const res_range = {
    min: null,
    max: ''
  }
  const { min, max } = init_range
  if (typeof min === 'object' && typeof max === 'object') {
    res_range.min = '不限'
    res_range.max = '不限'
  } else if (typeof min !== 'object' && typeof max === 'object') {
    res_range.min = min.toString()
    res_range.max = '不限'
  } else if (typeof min === 'object' && typeof max !== 'object') {
    res_range.min = '0'
    res_range.max = '不限'
  } else {
    res_range.min = min.toString()
    res_range.max = max.toString()
  }
  return res_range
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

/**
 * @param {Array} data 抛到父组件的数据数组
 * @description ntn组件抛出数据处理
 */
export function ntnData_handle (data) {
  var res = {
    content: '',
    range: {
      min: '',
      max: ''
    }
  }
  var content = ''
  var left = data[0].toString()
  var right = data[1].toString()
  if (left === right && left !== '') {
    // = num
    content = '=' + left
  } else if (left === '' && right === '') {
    // 不限
    left = '不限'
    right = '不限'
    content = '不限'
  } else if (left === '' && right !== '') {
    // [0, num)
    left = '0'
    content = '[' + left + ',' + right + ')'
  } else if (left !== '' && right === '') {
    // [num, 不限)
    right = '不限'
    content = '[' + left + ',' + right + ')'
  } else { // [left, right)
    content = '[' + left + ',' + right + ')'
  }
  res.content = content
  res.range.min = left
  res.range.max = right
  return res
}

/**
 * @param {Array} data 抛到父组件的数据数组
 * @description c-ntn组件抛出数据处理
 */
export function cntnData_handle (data) {
  var res = {
    content: '',
    range: {
      min: '',
      max: ''
    }
  }
  var content = ''
  var left = data[0] === null ? null : data[0].toString()
  var right = data[1] === null ? null : data[1].toString()
  if (left === right && left !== null) {
    // = num
    content = '=' + left
  } else if (left === null && right === null) {
    // 不限
    left = '不限'
    right = '不限'
    content = '不限'
  } else if (left === null && right !== null) {
    // [0, num)
    left = '0'
    content = '[' + left + ',' + right + ')'
  } else if (left !== null && right === null) {
    // [num, 不限)
    right = '不限'
    content = '[' + left + ',' + right + ')'
  } else { // [left, right)
    content = '[' + left + ',' + right + ')'
  }
  res.content = content
  res.range.min = left
  res.range.max = right
  return res
}

/**
 * @param {Array} arr 检测数组
 * @description 用于判断arr是否为数组
 */
export function isArray (arr) {
  if (!Array.isArray) {
    Array.isArray = (arg) => {
      return Object.prototype.toString.call(arg) === '[object Array]'
    }
  }
  return Array.isArray(arr)
}

/**
 * @param {Array} arr 数组
 * @description 数组去重
 */
export function unique (arr) {
  if (Array.from(new Set(arr))) {
    return Array.from(new Set(arr))
  } else {
    for (var i = 0; i < arr.length; i++) {
      for (var j = i + 1; j < arr.length; j++) {
        if (arr[i] === arr[j]) { // 第一个等同于第二个，splice方法删除第二个
          arr.splice(j, 1)
          j--
        }
      }
    }
    return arr
  }
}

/**
 * @description 用于获取截止到本月所有月份的中国标准时间格式数组和yyyy-mm-dd格式数组
 */
export const months_to_now = () => {
  var arr_s = [] // 中国标准时间格式数组
  var arr_n = [] // yyyy-mm-dd格式数组

  var d = new Date()
  var datetime = ''
  var s_datetime
  var m = d.getMonth() + 1
  for (let i = m; i > 0; i--) {
    if (i < 10) {
      datetime = d.getFullYear() + '-0' + i + '-01'
    } else {
      datetime = d.getFullYear() + '-' + i + '-01'
    }
    s_datetime = new Date(datetime + ' ')
    arr_s.push(s_datetime)
    arr_n.push(datetime)
  }

  return { arr_s: arr_s, arr_n: arr_n }
}

/**
 * @description 用于将获取yyyy-mm-dd格式的当前时间，且是1号
 */
export const month_now = () => {
  var d = new Date()
  var datetime = ''
  if (d.getMonth() < 9) {
    datetime = d.getFullYear() + '-0' + (d.getMonth() + 1) + '-01'
  } else {
    datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-01'
  }
  return datetime
}

/**
 * @param {Array} data 表格数据
 * @param {String} attr 需要合并的属性
 * @param {String} dep_attr 需要合并的属性的依赖属性
 * @description 根据特定属性处理合并列
 */
export const d_merge_handle = (data, attr, dep_attr) => {
  if (data) {
    var rowspans = []
    if (dep_attr) {
      // 有依赖属性
      var d_value = ''
      var data_arr = []
      var data_arr_pos = 0
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          d_value = data[0][dep_attr]
          data_arr[data_arr_pos] = []
          data_arr[data_arr_pos].push(data[0])
        } else {
          if (data[i][dep_attr] === d_value) {
            data_arr[data_arr_pos].push(data[i])
          } else {
            d_value = data[i][dep_attr]
            data_arr_pos++
            data_arr[data_arr_pos] = []
            data_arr[data_arr_pos].push(data[i])
          }
        }
      }
      data_arr.forEach(arr_item => {
        var temp_arr = merge_handle(arr_item, attr)
        rowspans = [...rowspans, ...temp_arr]
      })
    } else {
      // 没有依赖属性
      rowspans = merge_handle(data, attr)
    }
    return rowspans
  }
  return []
}

/**
 * @param {Array} data 表格数据
 * @param {String} attr 需要合并的属性
 * @description 根据特定属性处理合并列
 */
export const merge_handle = (data, attr) => {
  if (data) {
    var pos = 0
    var rowspans = []
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        rowspans[i] = 1
        pos = 0
      } else {
        if (data[i][attr] === data[i - 1][attr]) {
          rowspans[pos] += 1
          rowspans.push(0)
        } else {
          rowspans.push(1)
          pos = i
        }
      }
    }
    return rowspans
  }
  return []
}

/**
 * @param {Object} obj 请求参数的json
 * @param {Boolean} post_param post请求参数
 * @description 导出前处理
 */
export const before_export = (obj, post_param) => {
  if (obj && Object.keys(obj).length > 0) {
    var res_arr = []
    var keys_arr = Object.keys(obj)
    var str = ''
    keys_arr.forEach(item => {
      if (typeof obj[item] === 'object') {
        obj[item].forEach(i => {
          str = item + '=' + i
          res_arr.push(str)
        })
      } else if (typeof obj[item] === 'string') {
        str = item + '=' + obj[item]
        res_arr.push(str)
      }
    })
    if (post_param) return res_arr.join(',')
    return res_arr.join('&')
  }
}

/**
 * @param {Object} data 需要处理的表格数据
 * @description 表格月份处理
 */
export const mdata_handle = data => {
  if (data && data.length > 0) {
    for (var i = 0; i < data.length; i++) {
      var val = data[i].date
      if (val && val.length > 5) {
        data[i].date = val.split('-')[1] + '月'
      }
    }
    return data
  }
}

/**
 * @param {Array} arr 需要处理的数组
 * @description 数组元素字符串转数字
 */
export const atrToNum_handle = arr => {
  if (arr && arr.length > 0) {
    for (var i = 0; i < arr.length; i++) {
      arr[i] = Number(arr[i])
    }
    return arr
  }
}

/**
 * @param {String} url 地址
 * @param {String} params 参数
 * @description post方式的window.open请求
 */
export const openPostWindow = (url, params) => {
  const newWin = window.open(); let formStr = ''
  // 设置样式为隐藏，打开新标签再跳转页面前，如果有可现实的表单选项，用户会看到表单内容数据
  formStr = '<form style="visibility:hidden;" method="POST" target="_blank" action="' + url + '">' +
       '<input type="hidden" name="params" value="' + params + '" />' +
        '</form>'
  newWin.document.body.innerHTML = formStr
  newWin.document.forms[0].submit()
  return newWin
}

/**
 * @param {Number} length id长度
 * @description 生成唯一id
 */
export const genID = length => {
  return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
}

/**
 * @param {Array} arr 需要处理的已选游戏组
 * @description 游戏组拿到的选项处理
 */
export const gameGroup_handle = arr => {
  const res = {
    ids_arr: [],
    keys_arr: [],
    labels_arr: []
  }
  if (arr.length === 0) return res
  arr.forEach(game => {
    if (game.check) { // 全选某个游戏组
      res.labels_arr.push(game.value)
      if (game.children && game.children.length !== 0) {
        game.children.forEach(child => {
          res.ids_arr.push(child.id)
          res.keys_arr.push(child.key)
          res.labels_arr.push(child.value)
        })
      }
    } else if (game.children && game.children.length !== 0) { // 单选某个游戏包
      game.children.forEach(child => {
        if (child.check) {
          res.ids_arr.push(child.id)
          res.keys_arr.push(child.key)
          res.labels_arr.push(child.value)
        }
      })
    }
  })
  return res
}

/**
 * @param {Array} arr 需要处理的已选游戏组
 * @description 游戏组拿到的选项处理id裁剪
 */
export const gameGroup_tail = arr => {
  const res = {
    ids_arr: [],
    keys_arr: [],
    labels_arr: []
  }
  if (arr.length === 0) return res
  arr.forEach(game => {
    if (game.check) { // 全选某个游戏组
      res.labels_arr.push(game.value)
      if (game.children && game.children.length !== 0) {
        game.children.forEach(child => {
          const id = Number(child.key.split('-')[1])
          res.ids_arr.push(id)
          res.keys_arr.push(child.key)
          res.labels_arr.push(child.value)
        })
      }
    } else if (game.children && game.children.length !== 0) { // 单选某个游戏包
      game.children.forEach(child => {
        if (child.check) {
          const id = Number(child.key.split('-')[1])
          res.ids_arr.push(id)
          res.keys_arr.push(child.key)
          res.labels_arr.push(child.value)
        }
      })
    }
  })
  return res
}

/**
 * @param {Array} checked_arr 已选游戏组
 * @param {Array} init_arr 初始游戏组
 * @param {Boolean} def_selall 是否默认全选
 * @description 拿到的已选游戏组选项check处理
 */
export const set_gameGroup = (checked_arr, init_arr, def_selall = false) => {
  const res = []
  if (checked_arr.length === 0 && !def_selall) return init_arr
  if (init_arr && init_arr.length !== 0) {
    const temp_arr = deepCopy(init_arr)
    temp_arr.forEach(game => {
      if (def_selall || checked_arr.includes(game.key)) { // 没有children
        game.check = true
      } else if (game.children && game.children.length !== 0) { // 有children
        game.children.forEach(child => {
          if (def_selall || checked_arr.includes(child.key)) {
            child.check = true
          }
        })
      }
      res.push(game)
    })
  }
  return res
}

/**
 * @param {Array} checked_arr 已选游戏组
 * @param {Array} init_arr 初始游戏组
 * @param {Boolean} def_selall 是否默认全选
 * @description 拿到的已选游戏组选项check处理
 */
export const set_gameGroupcopy = (checked_arr, init_arr, def_selall = false, vue) => {
  const res = []
  if (checked_arr.length === 0 && !def_selall) return init_arr
  if (init_arr && init_arr.length !== 0) {
    init_arr.forEach(game => {
      if (def_selall || checked_arr.includes(game.key)) { // 没有children
        // game.check = true
        vue.$set(game, 'check', true)
      } else if (game.children && game.children.length !== 0) { // 有children
        game.children.forEach(child => {
          if (def_selall || checked_arr.includes(child.key)) {
            // child.check = true
            vue.$set(child, 'check', true)
          }
        })
      }
      res.push(game)
    })
  }
  // return res
}

/**
 * @param {Number} Index 列标
 * @description 表格列渐变
 */
export const gradual_change = Index => {
  var b = ''
  switch (Index) {
    case 5: // 成本
      b = 'background:rgba(125, 163, 199,0.2);'
      break
    case 7: // ROI
      b = 'background:rgba(247, 156, 156,0.2);'
      break
    case 18: // 留存2
      b = 'background:rgba(125, 163, 199,0.5);'
      break
    case 19: // 留存3
      b = 'background:rgba(125, 163, 199,0.4);'
      break
    case 20: // 留存7
      b = 'background:rgba(125, 163, 199,0.3);'
      break
    case 21: // 留存14
      b = 'background:rgba(125, 163, 199,0.2);'
      break
    case 22: // 留存30
      b = 'background:rgba(125, 163, 199,0.1);'
      break
    case 23: // 付费留存2
      b = 'background:rgba(247, 156, 156,0.5);'
      break
    case 24: // 付费留存3
      b = 'background:rgba(247, 156, 156,0.4);'
      break
    case 25: // 付费留存7
      b = 'background:rgba(247, 156, 156,0.3);'
      break
    case 26: // 付费留存14
      b = 'background:rgba(247, 156, 156,0.2);'
      break
    case 27: // 付费留存30
      b = 'background:rgba(247, 156, 156,0.1);'
      break
    default:
      b = ''
      break
  }
  return b
}

/**
 * @param {Object} row 行数据
 * @param {Number} columnIndex 列标
 * @description 按列定制颜色
 */
export const get_color_value = (row, columnIndex) => {
  let colorValue = ''
  let rate = {}
  switch (columnIndex) {
    case 3: // 1日
      rate = deepCopy(row.ltv_1day)
      break
    case 4: // 2日
      rate = deepCopy(row.ltv_2day)
      break
    case 5: // 3日
      rate = deepCopy(row.ltv_3day)
      break
    case 6: // 4日
      rate = deepCopy(row.ltv_4day)
      break
    case 7: // 5日
      rate = deepCopy(row.ltv_5day)
      break
    case 8: // 6日
      rate = deepCopy(row.ltv_6day)
      break
    case 9: // 7日
      rate = deepCopy(row.ltv_7day)
      break
    case 10: // 14日
      rate = deepCopy(row.ltv_14day)
      break
    case 11: // 21日
      rate = deepCopy(row.ltv_21day)
      break
    case 12: // 30日
      rate = deepCopy(row.ltv_30day)
      break
    case 13: // 45日
      rate = deepCopy(row.ltv_45day)
      break
    case 14: // 60日
      rate = deepCopy(row.ltv_60day)
      break
    case 15: // 75日
      rate = deepCopy(row.ltv_75day)
      break
    case 16: // 90日
      rate = deepCopy(row.ltv_90day)
      break
    case 17: // 105日
      rate = deepCopy(row.ltv_105day)
      break
    case 18: // 120日
      rate = deepCopy(row.ltv_120day)
      break
    case 19: // 135日
      rate = deepCopy(row.ltv_135day)
      break
    case 20: // 150日
      rate = deepCopy(row.ltv_150day)
      break
    case 21: // 165日
      rate = deepCopy(row.ltv_165day)
      break
    case 22: // 180日
      rate = deepCopy(row.ltv_180day)
      break
    case 23: // 210日
      rate = deepCopy(row.ltv_210day)
      break
    case 24: // 240日
      rate = deepCopy(row.ltv_240day)
      break
    case 25: // 270日
      rate = deepCopy(row.ltv_270day)
      break
    case 26: // 300日
      rate = deepCopy(row.ltv_300day)
      break
    case 27: // 330日
      rate = deepCopy(row.ltv_330day)
      break
    case 28: // 360日
      rate = deepCopy(row.ltv_360day)
      break
  }
  if (Object.keys(rate).length === 0) return colorValue
  if (rate.ltv_day_rate <= 5) {
    colorValue = '20'
  } else if (rate.ltv_day_rate <= 10) {
    colorValue = '40'
  } else if (rate.ltv_day_rate <= 20) {
    colorValue = '60'
  } else if (rate.ltv_day_rate <= 60) {
    colorValue = '80'
  } else {
    colorValue = '100'
  }
  return colorValue
}

/**
 * @param {Object} row 行数据
 * @param {Object} column 列
 * @param {Number} rowIndex 行标
 * @param {Number} columnIndex 列标
 * @description 表格单元格颜色定制
 */
export const color_cell_handle = (row, column, rowIndex, columnIndex) => {
  let cellStyle
  let colorValue = ''
  // 或许存在的简洁解决方案......等待优化
  // const index = columnIndex - 2
  // const rate = deepCopy(row[`ltv_${index}day`])
  colorValue = get_color_value(row, columnIndex)

  switch (colorValue) {
    case '20':
      cellStyle = 'background: rgba(125, 163, 199, 0.1);'
      break
    case '40':
      cellStyle = 'background: rgba(125, 163, 199, 0.2);'
      break
    case '60':
      cellStyle = 'background: rgba(125, 163, 199, 0.3);'
      break
    case '80':
      cellStyle = 'background: rgba(125, 163, 199, 0.4);'
      break
    case '100':
      cellStyle = 'background: rgba(125, 163, 199, 0.5);'
      break
    default:
      cellStyle = ''
  }
  return cellStyle
}
