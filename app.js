// app.js
App({
  globalData: {
    userInfo: null,
    hasLogin: false,
    // 预设球场数据
    courses: [
      { id: 'guanlan', name: '观澜湖球会', holes: 18, par: 72 },
      { id: 'szgc', name: '深圳高尔夫俱乐部', holes: 18, par: 72 },
      { id: 'dgfj', name: '东莞峰景高尔夫', holes: 18, par: 72 },
      { id: 'nsgc', name: '广州南沙高尔夫', holes: 18, par: 72 }
    ]
  },

  onLaunch() {
    // 检查登录状态
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
      this.globalData.hasLogin = true
    }
  }
})