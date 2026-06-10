// pages/index/index.js
const util = require('../../utils/util')

Page({
  data: {
    rounds: [],
    loading: true,
    showEmpty: true
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    // 加载历史球局
    const storage = wx.getStorageSync('rounds') || []
    const mockRounds = util.generateMockRounds()
    const allRounds = [...storage, ...mockRounds]
    this.setData({
      rounds: allRounds,
      loading: false,
      showEmpty: allRounds.length === 0
    })
  },

  // 开新球局
  goCreate() {
    wx.switchTab({ url: '/pages/create/create' })
  },

  // 查看报告
  goReport(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/report/report?id=${id}` })
  },

  onPullDownRefresh() {
    this.loadData()
    wx.stopPullDownRefresh()
  }
})