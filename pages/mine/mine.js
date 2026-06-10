// pages/mine/mine.js
const app = getApp()

Page({
  data: {
    userInfo: null,
    hasLogin: false,
    stats: {
      totalRounds: 0,
      avgScore: 0,
      bestScore: 0
    }
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const userInfo = app.globalData.userInfo
    this.setData({
      userInfo,
      hasLogin: !!userInfo
    })

    // 计算统计数据
    const storage = wx.getStorageSync('rounds') || []
    const rounds = storage
    if (rounds.length > 0) {
      const scores = rounds.map(r => r.totalStrokes)
      const avg = Math.round(scores.reduce((a,b) => a+b, 0) / scores.length * 10) / 10
      this.setData({
        stats: {
          totalRounds: rounds.length,
          avgScore: avg,
          bestScore: Math.min(...scores)
        }
      })
    }
  },

  // 微信登录
  onGetUserInfo(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      app.globalData.hasLogin = true
      this.setData({
        userInfo: e.detail.userInfo,
        hasLogin: true
      })
    }
  },

  // 查看战绩统计
  viewStats() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 设置
  goSettings() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 关于
  goAbout() {
    wx.showModal({
      title: '关于',
      content: '高尔夫AI助手 v1.0\n\n完全免费的极简高尔夫记录+AI分析工具。\n\n记录每一杆，提升每一步。',
      showCancel: false
    })
  }
})
