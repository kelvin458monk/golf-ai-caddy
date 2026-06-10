// pages/index/index.js
const util = require('../../utils/util')

Page({
  data: {
    rounds: [],
    loading: true,
    showEmpty: false
  },

  onLoad() {
    this.loadRounds()
  },

  onShow() {
    // 从记录页返回时刷新数据
    if (this.data.rounds.length > 0) {
      this.loadRounds()
    }
  },

  loadRounds() {
    const app = getApp()
    if (app.globalData.hasLogin) {
      this.loadFromCloud()
    } else {
      this.loadMockData()
    }
  },

  // 从云数据库加载（后续接入）
  loadFromCloud() {
    // TODO: 接入云数据库后实现
    this.loadMockData()
  },

  // 开发阶段使用模拟数据
  loadMockData() {
    const rounds = util.generateMockRounds()
    this.setData({
      rounds,
      loading: false,
      showEmpty: rounds.length === 0
    })
  },

  // 点击比赛进入详情
  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  // 新建比赛记录
  newRound() {
    wx.switchTab({
      url: '/pages/record/record'
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadRounds()
    wx.stopPullDownRefresh()
  }
})
