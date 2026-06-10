// pages/index/index.js
Page({
  data: {
    rounds: [],
    loading: false,
    showEmpty: true
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    // 从本地存储读取历史球局
    const storage = wx.getStorageSync('completedRounds') || []
    this.setData({
      rounds: storage,
      loading: false,
      showEmpty: storage.length === 0
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