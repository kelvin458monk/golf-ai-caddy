// pages/report/report.js
const util = require('../../utils/util')

Page({
  data: {
    round: null,
    analysis: null,
    loading: true,
    showAnalysis: false,
    analysisLoading: false
  },

  onLoad(options) {
    this.loadData()
  },

  loadData() {
    // 模拟数据（实际从云端获取）
    const mockHoles = []
    for (let i = 1; i <= 18; i++) {
      const par = [4, 4, 3, 5, 4, 4, 3, 5, 4, 4, 4, 3, 5, 4, 4, 3, 5, 4][i - 1]
      mockHoles.push({
        holeNumber: i,
        par,
        strokes: par + Math.floor(Math.random() * 4) - 1,
        clubs: ['7号铁', '推杆'],
        putts: Math.floor(Math.random() * 3) + 1,
        done: true
      })
    }

    const round = {
      roomId: 'room_demo',
      courseName: '观澜湖球会',
      date: util.formatDate(new Date()),
      holes: mockHoles,
      totalStrokes: mockHoles.reduce((s, h) => s + h.strokes, 0),
      totalPar: mockHoles.reduce((s, h) => s + h.par, 0)
    }

    this.setData({ round, loading: false })
  },

  // 生成AI分析
  getAnalysis() {
    this.setData({ analysisLoading: true })
    setTimeout(() => {
      const analysis = util.generateMockAnalysis(this.data.round)
      this.setData({
        analysis,
        showAnalysis: true,
        analysisLoading: false
      })
    }, 1500)
  },

  // 获取每洞成绩颜色
  getHoleClass(strokes, par) {
    const diff = strokes - par
    if (diff <= -2) return 'eagle'
    if (diff === -1) return 'birdie'
    if (diff === 0) return 'par'
    if (diff === 1) return 'bogey'
    if (diff === 2) return 'double'
    return 'other'
  },

  // 获取成绩标签
  getHoleLabel(strokes, par) {
    const diff = strokes - par
    if (diff <= -2) return '老鹰'
    if (diff === -1) return '小鸟'
    if (diff === 0) return '帕'
    if (diff === 1) return '博基'
    if (diff === 2) return '双博'
    return '超标'
  }
})