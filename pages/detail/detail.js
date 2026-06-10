// pages/detail/detail.js
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
    const id = parseInt(options.id)
    this.loadRoundData(id)
  },

  loadRoundData(id) {
    // 先从缓存读取
    const storage = wx.getStorageSync('rounds') || []
    const mockRounds = util.generateMockRounds()
    const allRounds = [...storage, ...mockRounds]
    const round = allRounds.find(r => r.id === id)
    
    if (round) {
      this.setData({
        round,
        loading: false
      })
    } else {
      wx.showToast({ title: '未找到记录', icon: 'none' })
      setTimeout(() => wx.navigateBack(), 1000)
    }
  },

  // 生成AI分析
  getAnalysis() {
    this.setData({ analysisLoading: true })

    // TODO: 接入真实AI API后替换
    // 目前使用模拟分析
    setTimeout(() => {
      const analysis = util.generateMockAnalysis(this.data.round)
      this.setData({
        analysis,
        showAnalysis: true,
        analysisLoading: false
      })
    }, 1500)
  },

  // 每洞成绩样式
  getHoleStyle(strokes, par) {
    const r = strokes - par
    if (r <= -2) return 'eagle'
    if (r === -1) return 'birdie'
    if (r === 0) return 'par'
    if (r === 1) return 'bogey'
    if (r === 2) return 'double-bogey'
    return 'other'
  },

  getHoleLabel(strokes, par) {
    const result = util.calcHoleResult(strokes, par)
    return result.label
  }
})
