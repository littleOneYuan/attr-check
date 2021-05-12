import { formatDate } from '@/common/js/utils'
export default [
  {
    text: '今天',
    value () {
      const start = new Date()
      const end = new Date()
      return [start, end]
    },
    onClick: () => {
      const shortCut = document.querySelectorAll('.ivu-picker-panel-shortcut')
      const len = shortCut.length
      for (let i = 0; i < len; i++) {
        shortCut[i].style.background = 'none'
      }
      shortCut[0].style.backgroundColor = '#e8eaec'
    }
  },
  {
    text: '昨天',
    value () {
      const start = new Date()
      const end = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      end.setTime(end.getTime() - 3600 * 1000 * 24)
      return [start, end]
    },
    onClick: () => {
      const shortCut = document.querySelectorAll('.ivu-picker-panel-shortcut')
      const len = shortCut.length
      for (let i = 0; i < len; i++) {
        shortCut[i].style.background = 'none'
      }
      shortCut[1].style.backgroundColor = '#e8eaec'
    }
  },
  {
    text: '本周',
    value () {
      const start = new Date()
      const end = new Date()
      let week = new Date().getDay()
      week = week > 0 ? week - 1 : 6
      start.setTime(start.getTime() - 3600 * 1000 * 24 * week)
      return [start, end]
    },
    onClick: () => {
      const shortCut = document.querySelectorAll('.ivu-picker-panel-shortcut')
      const len = shortCut.length
      for (let i = 0; i < len; i++) {
        shortCut[i].style.background = 'none'
      }
      shortCut[2].style.backgroundColor = '#e8eaec'
    }
  },
  {
    text: '近7天',
    value () {
      const today = formatDate(new Date(), 'yyyy/MM/dd 00:00:00')
      const end = new Date(today)
      const start = new Date()
      end.setTime(end.getTime())
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 6)
      return [start, end]
    },
    onClick: () => {
      const shortCut = document.querySelectorAll('.ivu-picker-panel-shortcut')
      const len = shortCut.length
      for (let i = 0; i < len; i++) {
        shortCut[i].style.background = 'none'
      }
      shortCut[3].style.backgroundColor = '#e8eaec'
    }
  },
  {
    text: '上周',
    value () {
      const start = new Date()
      const end = new Date()
      let week = new Date().getDay()
      week = week > 0 ? week : 7
      end.setTime(end.getTime() - 3600 * 1000 * 24 * week)
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 6)
      return [start, end]
    },
    onClick: () => {
      const shortCut = document.querySelectorAll('.ivu-picker-panel-shortcut')
      const len = shortCut.length
      for (let i = 0; i < len; i++) {
        shortCut[i].style.background = 'none'
      }
      shortCut[4].style.backgroundColor = '#e8eaec'
    }
  },
  {
    text: '本月',
    value () {
      const first = formatDate(new Date(), 'yyyy/MM/01')
      const start = new Date(first)
      const end = new Date()
      return [start, end]
    },
    onClick: () => {
      const shortCut = document.querySelectorAll('.ivu-picker-panel-shortcut')
      const len = shortCut.length
      for (let i = 0; i < len; i++) {
        shortCut[i].style.background = 'none'
      }
      shortCut[5].style.backgroundColor = '#e8eaec'
    }
  },
  {
    text: '上个月',
    value () {
      let year = formatDate(new Date(), 'yyyy')
      let month = formatDate(new Date(), 'MM')
      if (month > 1) month--
      else {
        month = 12
        year--
      }
      const max = new Date(year, month, 0).getDate()
      const start = new Date(`${year}/${month}/01`)
      const end = new Date()
      end.setTime(start.getTime() + 3600 * 1000 * 24 * max - 1000)
      return [start, end]
    },
    onClick: () => {
      const shortCut = document.querySelectorAll('.ivu-picker-panel-shortcut')
      const len = shortCut.length
      for (let i = 0; i < len; i++) {
        shortCut[i].style.background = 'none'
      }
      shortCut[6].style.backgroundColor = '#e8eaec'
    }
  }
]
